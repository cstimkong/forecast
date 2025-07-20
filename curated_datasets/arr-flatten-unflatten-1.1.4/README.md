# arr-flatten-unflatten

[![package version](https://img.shields.io/npm/v/arr-flatten-unflatten.svg?style=flat-square)](https://npmjs.org/package/arr-flatten-unflatten)
[![package downloads](https://img.shields.io/npm/dm/arr-flatten-unflatten.svg?style=flat-square)](https://npmjs.org/package/arr-flatten-unflatten)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/arr-flatten-unflatten.svg?style=flat-square)](https://npmjs.org/package/arr-flatten-unflatten)

> non-recursive method of flattening an array or arrays and unflattening the result

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save arr-flatten-unflatten
```

Install with [yarn](https://yarnpkg.com):

```sh
$ yarn add arr-flatten-unflatten
```

## Usage

```js
const { flatten, unflatten } = require("arr-flatten-unflatten");

let flat = flatten([2, 4, [8, [2, [32, 64]], 7], 5]);
/**
 * => {
 * "[0]": 2,
 * "[1]": 4,
 * "[2][0]": 8,
 * "[2][1][0]": 2,
 * "[2][1][1][0]": 32,
 * "[2][1][1][1]": 64,
 * "[2][2]": 7,
 * "[3]": 5
 * }
 * */

unflatten(flat);
// => [2, 4, [8, [2, [32, 64]], 7], 5]
```

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Author

- [github/Quernest](https://github.com/quernest)

### License

Copyright © 2019, [Quernest](https://github.com/Quernest).
Released under the [MIT License](LICENSE).

---
