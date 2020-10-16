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

const pbconfigContent = {
	options: {
		'no-create': false,
		'no-encode': false,
		'no-decode': false,
		'no-verify': false,
		'no-convert': true,
		'no-delimited': false,
		'force-long': false,
		'force-number': false,
		'force-message': false,
	},
	sourceRoot: 'protofile',
	outputFile: 'bundles/protobuf-bundles.js',
};

type ProtobufConfig = typeof pbconfigContent;

export async function generate(rootDir: string) {
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
	const tempfile = path.join(os.tmpdir(), 'porky-pb', 'temp.js');
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
	_.each(pbconfig.options, (value: boolean, key: string) => {
		if (key in pbconfigContent.options) {
			if (value) {
				args.unshift('--' + key);
			}
		} else {
			console.log('Unknown option:', key);
		}
	});

	await shell('npx pbjs', args);
	let pbjsResult: string = await fs.readFile(tempfile, 'utf-8');
	pbjsResult = 'var $protobuf = window.protobuf;\n$protobuf.roots.default=window;\n' + pbjsResult;
	await fs.writeFile(output, pbjsResult, 'utf-8');
	await shell('npx pbts', ['--main', output, '-o', tempfile]);
	let pbtsResult: string = await fs.readFile(tempfile, 'utf-8');
	pbtsResult = pbtsResult
		.replace(/\$protobuf/gi, 'protobuf')
		.replace(/export namespace/gi, 'declare namespace');
	pbtsResult = 'type Long = protobuf.Long;\n' + pbtsResult;
	await fs.writeFile(output.replace('.js', '.d.ts'), pbtsResult, 'utf-8');
	await fs.remove(tempfile);
}

export async function add(projectRoot: string) {
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
	let pbconfig: ProtobufConfig = _.clone(pbconfigContent);
	if (fs.existsSync(configPath)) {
		pbconfig = _.merge(pbconfig, fs.readJsonSync(configPath));
	}

	await fs.outputJson(configPath, pbconfig, {
		spaces: 4,
	});
}
