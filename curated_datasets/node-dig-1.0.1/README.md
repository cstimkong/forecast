# node-dig
This library enables you to access nested elements in Object.

## installation
```
npm install --save node-dig
```

## Usage
```js
const dig = require('node-dig');

let object = {};

// set value
dig(object, ['a', 'b', 'c'], 10);

// { a: { b: { c: 10 } } }
console.log(object);

// get value
const value = dig(object, ['a', 'b', 'c']);

// 10
console.log(value);
```
