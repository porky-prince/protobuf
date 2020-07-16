#!/usr/bin/env node
'use strict';
const program = require('commander');
const pkg = require('../package.json');
const protobuf = require('../dist/main');

program
	.version(pkg.version, '-v, --version')
	.description(pkg.description)
	.usage('<command>')
	.on('--help', () => {
		console.log('');
		console.log('Examples:');
		console.log(`  $ porky-pb --help`);
		console.log('');
		console.log(`${pkg.license} © ${pkg.author}`);
	});

program.command('add <projectRoot>').description('');

program.command('generate <projectRoot>').description('');

program.parse(process.argv);
