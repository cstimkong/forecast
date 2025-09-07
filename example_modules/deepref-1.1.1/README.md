DeepRef
=========

Write to a deeply nested reference within an object.

## Installation
  ```
  npm install deepref --save
  ```

## Usage
  ```javascript
  var deep = require('deepref');

  var obj = {};

  deep.set(obj, 'a', 'obj.a is set to this');

  console.dir(obj);
  // { a: 'obj.a is set to this' }

  deep.set(obj, 'b.c', 'we can set nested fields');

  console.dir(obj);
  /*
  * {
  *  a: 'obj.a is set to this',
  *  b: {
  *    c: 'we can set nested fields'
  *  }
  *	}
  */

  deep.set(obj, 'd.0', 'we can even..');
  deep.set(obj, 'd.1', '..create arrays..');
  deep.set(obj, 'd.2', '..by using an integer as the index');

  console.dir(obj);
  /*
  * {
  *  a: 'obj.a is set to this',
  *  b: {
  *    c: 'we can set nested fields'
  *  },
  *  d: [
  *    'we can even..',
  *    '..create arrays..',
  *    '..by using an integer as the index'
  *  ]
  *	}
  */
  ```

## Tests
  ```
  npm test
  ```

## Contributing

Please use the included style guide.  If you change anything, please test
and add unit tests for any new functionality.  If you're fixing a bug, please
add a unit test that would have failed before the bug was fixed.  Thanks!