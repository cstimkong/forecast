"use strict";

const wrap = require('./wrap');

function flatten(arr = []) {
  if (!Array.isArray(arr)) {
    return arr;
  }

  let i = 0;
  let input = [arr];
  let lastIndex = [-1];
  let flat = {};

  while (input.length) {
    arr = input.pop();
    i = lastIndex.pop() + 1;

    for (; i < arr.length; ++i) {
      if (Array.isArray(arr[i])) {
        input.push(arr);
        lastIndex.push(i);
        arr = arr[i];
        i = -1;
      } else {
        const path = lastIndex.length === 0 ? i : lastIndex.concat(i);
        flat[wrap(path)] = arr[i];
      }
    }
  }
  
  return flat;
}

module.exports = flatten;
