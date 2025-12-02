'use strict';

const dig = require('../lib/dig');

let object = {};

// set value
dig(object, ['a', 'b', 'c'], 10);

// { a: { b: { c: 10 } } }
console.log(object);

// get value
const value = dig(object, ['a', 'b', 'c']);

// 10
console.log(value);
