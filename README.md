[![npm][npm]][npm-url]
[![node][node]][node-url]
[![size][size]][size-url]

# protobuf

> Protocol buffers for H5 game

## Install

### Local

npm:

```sh
$ npm install --save protobuf
```

yarn:

```sh
$ yarn add protobuf
```

### Global

npm:

```sh
$ npm install -g protobuf
```

yarn:

```sh
$ yarn add global protobuf
```

## Usage

### Using in code

#### Using es5 in node

```js
const protobuf = require('protobuf');

protobuf('args');
```

#### Using es6 or typescript in node

```js
import protobuf from 'protobuf';

protobuf('args');
```

### Command line usage

First, you have to install the dependency package globally

```sh
$ protobuf [options]
```

example:

```sh
$ protobuf -i inputPath -o outputDir
```

#### Command line options

```
    --version               	Print version number.
    -h, --help                  Print usage information.
    -i, --input                 Input path.
    -o, --output [options]   	Output dir.
    -f, --filename [options]    Output filename.
```

## License

[MIT © PorkyKay](./LICENSE)

[npm]: https://img.shields.io/npm/v/protobuf.svg
[npm-url]: https://npmjs.com/package/protobuf
[node]: https://img.shields.io/node/v/protobuf.svg
[node-url]: https://nodejs.org
[size]: https://packagephobia.now.sh/badge?p=protobuf
[size-url]: https://packagephobia.now.sh/result?p=protobuf
