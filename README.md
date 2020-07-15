# protobuf

> Protocol buffers for H5 game

## Install

### Local

npm:

```sh
$ npm install --save @porky-prince/protobuf
```

yarn:

```sh
$ yarn add @porky-prince/protobuf
```

### Global

npm:

```sh
$ npm install -g @porky-prince/protobuf
```

yarn:

```sh
$ yarn add global @porky-prince/protobuf
```

## Usage

### Using in code

#### Using es5 in node

```js
const protobuf = require('@porky-prince/protobuf');

protobuf('args');
```

#### Using es6 or typescript in node

```js
import protobuf from '@porky-prince/protobuf';

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
