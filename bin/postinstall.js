'use strict';
const path = require('path');
const { add } = require('../dist/main');
const projectRoot = path.join(process.cwd(), '../../../');

add(projectRoot, false);
