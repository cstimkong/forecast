
/**
 * 
 * This file is part of FesaJS
 *
 */

'use strict';

import { makeArbitraryString, randomChoice } from './helper';

export function makeProxyArray() {
    let array = [];
    let count = Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        array.push(randomChoice([
            function() { return makeProxyObject(); },
            function() { return makeProxyString(); },
        ]));
    }
    return array;
}


export function makeProxyString(value) {
    let __concreteval__ = null;
    if (typeof value === 'string') {
        __concreteval__ = value;
    }
    
    return new Proxy({}, {
        get(target, p, receiver) {
            /* Sign of a tainted string */
            if (p === '__tainted__') {
                return true;
            }

            /* Trap typeof operator, see code instrumentation */
            if (p === '__typeof__') {
                return 'string';
            }

            /* Return the internal string. For internal use only */
            if (p === '__internalstr__') {
                return __concreteval__;
            }

            if (!__concreteval__) {
                __concreteval__ = makeRandomString();
            }

            if (p === 'length') {
                return __concreteval__.length;
            }

            else if (p === 'toString') {
                return function() {
                    return makeProxyString(__concreteval__)
                }
            }

            else if (p === 'charAt') {
                return function() {
                    return String.prototype.charAt.apply(__concreteval__, arguments);
                }
            }

            else if (p === 'substring' || p === 'replace' || p === 'toLowerCase' || p === 'toUpperCase' 
                || p === 'trim' || p === 'trimLeft' || p === 'trimRight' || p === 'trimStart' || p === 'trimEnd'
                || p === 'sub' || p === 'sup') {
                return function() {
                    return makeProxyString(String.prototype[p].apply(__concreteval__, arguments));
                }
            }

            else if (p === 'split') {
                return function() {
                    let array = String.prototype.split.apply(__concreteval__, arguments);
                    for (let i = 0; i < array.length; i++) {
                        array[i] = makeProxyString(array[i]);
                    }
                    return array;
                }
            }

            else if (p === 'slice') {
                return function() {
                    return makeProxyString(String.prototype.slice.apply(__concreteval__, arguments));
                }
            }
            
            else if (p === 'indexOf' || p === 'lastIndexOf' || p === 'includes' || p === 'startsWith') {
                return String.prototype.indexOf.apply(__concreteval__, arguments);
            }

            else if (p === Symbol.toPrimitive) {
                return function(hint) {
                    if (hint === 'string') {
                        return __concreteval__;
                    }
                    throw new Error('Unexpected hint for string.');
                }
            }

        },

        set(_) {
            return false; // prevent setting properties
        },

        ownKeys(_) {
            throw new Error('Get own key operation cannot be applied to a string.');
        },

        deleteProperty(_) {
            throw new Error('Delete key operation cannot be applied to a string.');
        }
    });
}

/**
 * 
 * @returns a proxy `Object`
 */
export function makeProxyObject() {

    return new Proxy(function() { }, {
        get: function(target, p, receiver) {
            /* Sign of a proxy object */
            if (p === '__tainted__') {
                return true;
            }
            
            /* Return the internal `target` */
            if (p === '__internalobj__') {
                return target;
            }

            /* Trap typeof operator */
            if (p === '__typeof__') {
                return 'object';
            }

            if (p === Symbol.toPrimitive) {
                return function(hint) {
                    throw new Error('Unexpected hint for object.');
                }
            }

            if (Object.hasOwn(target, p)) {
                return target[p];
            }

            if (Object.hasOwn(target, Symbol.for(`__tainted__${p}`))) {
                return target[Symbol.for(`__tainted__${p}`)];
            }

            return randomChoice([
                function() {
                    target[p] = makeProxyObject();
                    return target[p];
                },
                function() { 
                    target[p] = makeProxyString();
                    return target[p];
                },
                function() {
                    target[p] = makeProxyArray();
                    return target[p];
                },
                function() {
                    return undefined;
                }
            ])
        },

        set: function(target, p, value, receiver) {
            target[p] = value;
            return true;
        },

        ownKeys: function(target) {
            let keys = Object.keys(target);
            if (keys.length === 0) {
                return randomChoice(
                    function() { return []; },
                    function() {
                        let arbitraryString = makeArbitraryString();
                        target[Symbol.for(`__tainted__${arbitraryString}`)] = randomChoice(
                            [
                                function() { return makeProxyObject(); },
                                function() { return makeProxyString(); },
                                function() { return makeProxyArray(); }
                            ]
                        );
                        return [makeProxyString(arbitraryString)];
                    }
                )
            }
            for (let [idx, elem] of keys.entries()) {
                keys[idx] = makeProxyString(elem);
            }
            return keys;
        },
        
        deleteProperty: function(target, p) {
            delete target[p];
            return true;
        }

    })
}
