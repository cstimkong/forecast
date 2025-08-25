
/**
 * 
 * Mocked `Set` class
 */

let objectHash = require('object-hash');
const { makeProxyString } = require('../proxy');

class MockedSet {
    __internal = {};
    constructor(iterable) {
        let iterator = iterable[Symbol.iterator]();
        while (true) {
            let {value, done} = iterator.next();
            this.add(value);
            if (done) {
                break;
            }
        }
    }

    add(v) {
        let hash = objectHash(v);
        if (!this.__internal[hash]) {
            this.__internal[hash] = [];
        }
        if (typeof v === 'object' && v !== null && v.__tainted__ && v.__typeof__ === 'string') {
            let bucket = this.__internal[hash];
            for (let i = 0; i < bucket.length; i++) {
                if (v.__internalstr__ === bucket[i]) {
                    bucket[i] = makeProxyString(bucket[i]);
                }
            }
        }
    }
}