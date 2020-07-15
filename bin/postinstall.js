'use strict';
const path = require('path');
const { run } = require('../dist/main');
const projectRoot = path.join(process.cwd(), '../../');

run('add', projectRoot);
