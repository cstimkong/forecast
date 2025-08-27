
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
            let { value, done } = iterator.next();
            this.add(value);
            if (done) {
                break;
            }
        }
    }

    add(v) {
        /* if the added value is a proxy string */
        if (typeof v === 'object' && v !== null && v.__tainted__ && v.__typeof__ === 'string') {
            let hash = objectHash(v.__internalstr__);
            if (!this.__internal[hash]) {
                this.__internal[hash] = [];
            }
            let bucket = this.__internal[hash];
            let i = 0;
            for (; i < bucket.length; i++) {
                if (v.__internalstr__ === bucket[i]) {
                    bucket[i] = makeProxyString(bucket[i]);
                    break;
                }
                if (typeof bucket[i] === 'object' && bucket[i] !== null && bucket[i].__typeof__ === 'string' 
                    && bucket[i].__internalstr__ === v.__internalstr__) {
                    break;
                }
            }
            if (i === bucket.length) {
                bucket.push(v);
            }
        }

        else if (typeof v === 'string') {
            let hash = objectHash(v);
            if (!this.__internal[hash]) {
                this.__internal[hash] = [];
            }
            let bucket = this.__internal[hash];
            let i = 0;
            for (; i < bucket.length; i++) {
                if (v === bucket[i]) {
                    break;
                }
                if (typeof bucket[i] === 'object' && bucket[i] !== null && bucket[i].__typeof__ === 'string'
                    && bucket[i].__internalstr__ === v) {
                    break;
                }

            }
            if (i === bucket.length) {
                bucket.push(v);
            }
        }
    }
}

module.exports = MockedSet;