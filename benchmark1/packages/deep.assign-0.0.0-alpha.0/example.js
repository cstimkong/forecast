'use strict';
const DEEP_MERGE = require('deepmerge');
const LODASH_MERGE = require('lodash.merge');
const deepAssign = require('./index').deepAssign;
const deepMerge = require('./index').deepMerge;

console.time('copy');
let result;
for (let i = 0; i < 1; i++) {
  // result = DEEP_MERGE({}, {
  //   a: 'a',
  //   b: {
  //     a: {
  //       a: {
  //         a: 'a',
  //         b: {
  //           a: 'a',
  //           b: 'b'
  //         }
  //       }
  //     }
  //   },
  //   c: 'c',
  //   d: 'd',
  //   e: {
  //     a: {
  //       a: 'a',
  //       b: 'b',
  //       c: {
  //         a: 'a'
  //       }
  //     }
  //   }
  // }, { clone: true });
  // result = LODASH_MERGE({}, {
  //   a: 'a',
  //   b: {
  //     a: {
  //       a: {
  //         a: 'a',
  //         b: {
  //           a: 'a',
  //           b: 'b'
  //         }
  //       }
  //     }
  //   },
  //   c: 'c',
  //   d: 'd',
  //   e: {
  //     a: {
  //       a: 'a',
  //       b: 'b',
  //       c: {
  //         a: 'a'
  //       }
  //     }
  //   },
  //   f: {
  //     a: [1, 2, { a: 'a' }]
  //   }
  // });
  result = deepMerge({}, {
    a: 'a',
    b: {
      a: {
        a: {
          a: 'a',
          b: {
            a: 'a',
            b: 'b'
          }
        }
      }
    },
    c: 'c',
    d: 'd',
    e: {
      a: {
        a: 'a',
        b: 'b',
        c: {
          a: 'a'
        }
      }
    },
    f: {
      a: [1, 2, { a: 'a' }]
    }
  }, { depth: 1 });
}
console.timeEnd('copy');
console.log(JSON.stringify(result, null, 2));

