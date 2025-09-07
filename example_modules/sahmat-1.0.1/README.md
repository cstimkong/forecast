# sahmat

[![Build Status](https://travis-ci.org/indatawetrust/sahmat.svg?branch=master)](https://travis-ci.org/indatawetrust/sahmat)

simple getter and setter for deep objects

### Installation

```sh
npm i -S sahmat
```

### Usage

```js

const sahmat = require('sahmat')

const obj = {
  one: {
    two: {
      a: 1,
      b: [3,4,5]
    }
  }
}

// GET

sahmat(obj, 'one.two.a')
// 1

sahmat(obj, 'one.two.b.2')
// 5

// SET

sahmat(obj, 'one', {})

sahmat(obj, 'one')

// {}

```

License
----

MIT
