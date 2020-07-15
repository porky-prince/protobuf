import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as _ from 'lodash';

async function shell(command: string, args: string[]) {
	return new Promise<string>((resolve, reject) => {
		const cmd = command + ' ' + args.join(' ');
		child_process.exec(cmd, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

type ProtobufConfig = {
	options: {
		'no-create': boolean;
		'no-verify': boolean;
		'no-convert': boolean;
		'no-delimited': boolean;
		'no-encode': boolean;
		'no-decode': boolean;
	};

	sourceRoot: string;
	outputFile: string;
};

let pbconfigContent: ProtobufConfig = {
	options: {
		'no-create': false,
		'no-verify': false,
		'no-convert': true,
		'no-delimited': false,
		'no-encode': false,
		'no-decode': false,
	},
	sourceRoot: 'protofile',
	outputFile: 'bundles/protobuf-bundles.js',
};

async function generate(rootDir: string) {
	const pbconfigPath = path.join(rootDir, 'pbconfig.json');
	if (!fs.existsSync(pbconfigPath)) {
		if (fs.existsSync(path.join(rootDir, 'protobuf'))) {
			const pbconfigPath = path.join(rootDir, 'protobuf', 'pbconfig.json');
			if (!fs.existsSync(pbconfigPath)) {
				await fs.outputJson(pbconfigPath, pbconfigContent);
			}

			await generate(path.join(rootDir, 'protobuf'));
		} else {
			throw new Error('请首先执行 porky-pb add 命令');
		}

		return;
	}

	const pbconfig: ProtobufConfig = await fs.readJson(path.join(rootDir, 'pbconfig.json'));
	const tempfile = path.join(os.tmpdir(), 'pb-temp', 'temp.js');
	await fs.ensureDir(path.dirname(tempfile));
	const output = path.join(rootDir, pbconfig.outputFile);
	const dirname = path.dirname(output);
	await fs.ensureDir(dirname);
	const protoRoot = path.join(rootDir, pbconfig.sourceRoot);
	await fs.ensureDir(protoRoot);
	const fileList = await fs.readdir(protoRoot);
	const protoList = fileList.filter(item => path.extname(item) === '.proto');
	if (protoList.length === 0) {
		throw new Error(' protofile 文件夹中不存在 .proto 文件');
	}

	await Promise.all(
		protoList.map(async (protofile: string) => {
			const content: string = await fs.readFile(path.join(protoRoot, protofile), 'utf-8');
			if (!content.includes('package')) {
				throw new Error(`${protofile} 中必须包含 package 字段`);
			}
		})
	);

	// prettier-ignore
	const args = [
		'-t',
		'static',
		'--keep-case',
		'-p',
		protoRoot,
		protoList.join(' '),
		'-o',
		tempfile
	];
	if (pbconfig.options['no-create']) {
		args.unshift('--no-create');
	}

	if (pbconfig.options['no-verify']) {
		args.unshift('--no-verify');
	}

	if (pbconfig.options['no-convert']) {
		args.unshift('--no-convert');
	}

	if (pbconfig.options['no-delimited']) {
		args.unshift('--no-delimited');
	}

	if (pbconfig.options['no-encode']) {
		args.unshift('--no-encode');
	}

	if (pbconfig.options['no-decode']) {
		args.unshift('--no-decode');
	}

	await shell('npm run pbjs --', args);
	let pbjsResult: string = await fs.readFile(tempfile, 'utf-8');
	pbjsResult = 'var $protobuf = window.protobuf;\n$protobuf.roots.default=window;\n' + pbjsResult;
	await fs.writeFile(output, pbjsResult, 'utf-8');
	await shell('npm run pbts --', ['--main', output, '-o', tempfile]);
	let pbtsResult: string = await fs.readFile(tempfile, 'utf-8');
	pbtsResult = pbtsResult
		.replace(/\$protobuf/gi, 'protobuf')
		.replace(/export namespace/gi, 'declare namespace');
	pbtsResult = 'type Long = protobuf.Long;\n' + pbtsResult;
	await fs.writeFile(output.replace('.js', '.d.ts'), pbtsResult, 'utf-8');
	await fs.remove(tempfile);
}

async function add(projectRoot: string) {
	console.log('正在将 protobuf 源码拷贝至项目中...');
	const protobufRoot = path.dirname(require.resolve('protobufjs'));

	await fs.copy(
		path.join(protobufRoot, 'dist', 'protobuf.js'),
		path.join(projectRoot, 'protobuf/library/protobuf.js')
	);
	await fs.copy(
		path.join(protobufRoot, 'index.d.ts'),
		path.join(projectRoot, 'protobuf/library/protobuf.d.ts')
	);

	const configPath: string = path.join(projectRoot, 'protobuf/pbconfig.json');
	if (fs.existsSync(configPath)) {
		pbconfigContent = _.merge(pbconfigContent, fs.readJsonSync(configPath));
	}

	await fs.outputJson(configPath, pbconfigContent, {
		spaces: 4,
	});
}

export default function run(command: string, projectRoot: string) {
	run_1(command, projectRoot).catch(e => console.log(e));
}

async function run_1(command: string, projectRoot: string) {
	if (command === 'add') {
		await add(projectRoot);
	} else if (command === 'generate') {
		await generate(projectRoot);
	} else {
		console.error('请输入命令: add / generate');
	}
}
