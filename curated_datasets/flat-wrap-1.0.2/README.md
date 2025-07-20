# flat-wrap [![Build Status](https://travis-ci.org/piyush44903/flat-wrap.svg?branch=master)](https://travis-ci.org/piyush44903/flat-wrap)
Flattening/unflattening nested objects without losing keys for blank objects / empty arrays

## Installation

``` bash
$ npm install flat-wrap
```

## The catch
A manual updation on the flatten/unflatten logic to mark empty objects ({}) and empty arrays([]) while flattening and replacing them with appropriate values upon unflattening

## Methods

### flatten(original, options)

Flattens the object - it'll return an object one level deep, regardless of how
nested the original object was:

``` javascript
const { flatten } = require('flat-wrap')

flatten({
	key1: {
		keyA: 'valueI'
	},
	key2: {
		keyB: 'valueII'
	},
	key3: { a: { b: { c: 2 } } }
})

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a.b.c': 2
// }
```

### unflatten(original, options)
``` javascript
const { unflatten } = require('flat-wrap');

unflatten({
	'three.levels.deep': 42,
	'three.levels': {
		nested: true
	}
})

// {
//     three: {
//         levels: {
//             deep: 42,
//             nested: true
//         }
//     }
// }
```

## Options

### delimiter

Use a custom delimiter for (un)flattening your objects, instead of `.`.

```
