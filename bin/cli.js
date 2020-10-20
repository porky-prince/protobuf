#!/usr/bin/env node
'use strict';
const program = require('commander');
const pkg = require('../package.json');
const protobuf = require('../dist/main');

program
	.name('porky-pb')
	.version(pkg.version, '-v, --version')
	.description(pkg.description)
	.usage('<command>')
	.on('--help', () => {
		console.log('');
		console.log('Examples:');
		console.log('  $ porky-pb -h');
		console.log('');
		console.log(`${pkg.license} © ${pkg.author}`);
	});

program
	.command('add <projectRoot>')
	.description('add protobuf.js, protobuf.d.ts and pbconfig.json to your project')
	.option('-o, --overwrite [boolean]', 'overwrite if file exists', false)
	.action((projectRoot, opt) => {
		protobuf.add(projectRoot, opt.overwrite);
	});

program
	.command('generate <projectRoot>')
	.description('generate bundle.js and bundle.d.ts to your project by proto files')
	.action(protobuf.generate);

program.parse(process.argv);
