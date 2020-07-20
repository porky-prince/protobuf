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

```js
const protobuf = require('@porky-prince/protobuf');

async function run() {
	await protobuf.add(projectRoot);
	await protobuf.generate(projectRoot);
}
```

### Command line usage

First, you have to install the dependency package globally

```sh
$ porky-pb <command>
```

example:

```sh
$ porky-pb generate you-project-root
```

#### Command line options

```
  add <projectRoot>       add protobuf.js, protobuf.d.ts and pbconfig.json to
                          your project
  generate <projectRoot>  generate bundle.js and bundle.d.ts to your project
                          by proto files
  help [command]          display help for command
```

## Reference

[@egret/protobuf](https://www.npmjs.com/package/@egret/protobuf)

## License

[MIT © PorkyKay](./LICENSE)
