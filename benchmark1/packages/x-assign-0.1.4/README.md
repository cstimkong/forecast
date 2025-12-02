# x-assign
An improved Object.assign that will merge nested objects and concatenate arrays.

[![Coverage Status](https://coveralls.io/repos/github/mvoorberg/x-assign/badge.svg?branch=main)](https://coveralls.io/github/mvoorberg/x-assign?branch=main)
[![Build Status](https://travis-ci.com/mvoorberg/x-assign.svg?branch=main)](https://travis-ci.com/mvoorberg/x-assign)
## Installation

```bash
$ npm install x-assign
```

## Usage

```javascript
const XAssign = require("x-assign");

const a = {red: "apple"};
const b = {green: "pear"};
const c = XAssign.assign(a, b);

console.log(c); 
> {
>    red: "apple",
>    green: "pear"
> }
```

## Need Support?
x-assign is a [software development project](https://binaryops.ca) by BinaryOps Software Inc.
