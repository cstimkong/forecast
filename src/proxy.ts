/**
 * 
 * This file is part of Forecast.
 *
 */

import { randomChoice, ModifyPrototypeSignal } from './helper.js';

const TAINT_STRING_LITERAL = '__taintstr__';

export function makeProxyArray(): Array<any> {
    let array = [];
    let count = Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        array.push(randomChoice<any>([
            function () { return makeProxyObject(); },
            function () { return proxyString; },
        ]));
    }
    return array;
}

export const proxyString: any = (function() {
    let o: any = {
        [Symbol.toPrimitive]() {
            return TAINT_STRING_LITERAL;
        },
        ['__TYPEOF__']: 'string'
    };

    for (let m of ['charAt', 'substring', 'slice', 'replace', 'trim', 'trimLeft', 'trimRight', 'toUpperCase', 'toLowerCase', 'toLocaleUpperCase', 'toLocaleLowerCase']) {
        o[m] = function() {
            return o;
        }
    }

    for (let m of ['indexOf', 'lastIndexOf']) {
        o[m] = function() {
            return randomChoice([
                function() { return 0; },
                function() { return -1; }
            ])
        }
    }

    for (let m of ['startsWith', 'endsWith', 'match']) {
        o[m] = function() {
            return randomChoice([
                function() { return true; },
                function() { return false; }
            ])
        }
    }

    o['split'] = function() {
        return randomChoice([
            function() { return [o]},
            function() { return [o, o]},
            function() { return [o, o, o]}
        ]);
    }
    return o;
})();

const mockedObjectPrototype = (function() {
    return new Proxy(Object.prototype, {
        get(target, p) {
            if (p === '__proto__') {
                return null;
            }
            if (p === 'constructor') {
                return MockedObject;
            }
            return (target as any)[p];
        },
        set(_, p, v) {
            throw new ModifyPrototypeSignal('Object.prototype', p, v);
        }
    })
})();

const MockedObject = (function() {
    return new Proxy(Object, {
        get(target, p) {
            if (p === 'prototype') {
                return mockedObjectPrototype;
            }
            return (target as any)[p];
        },
        construct() {
            return Object.create(mockedObjectPrototype);
        },
        apply() {
            return Object.create(mockedObjectPrototype);
        }
    })
})();

/**
 * 
 * @returns a proxy `Object`
 */
export function makeProxyObject() {

    return new Proxy((function () { }) as any, {
        get: function (target, p, _) {
            // Sign of a proxy object
            if (p === '__ISTAINTED__') {
                return true;
            }

            // Return the internal `target`
            if (p === '__INTERNAL__') {
                return target;
            }

            // Trap typeof operator
            if (p === '__TYPEOF__') {
                return 'object';
            }

            if (p === Symbol.toPrimitive) {
                return function () {
                    throw new Error('Unexpected hint for object.');
                }
            }

            if (Object.hasOwn(target, p)) {
                return target[p];
            }

            if (p === TAINT_STRING_LITERAL) {
                return randomChoice([
                    function() {
                        return Object.prototype;
                    },
                    function() {
                        target[p] = makeProxyObject();
                        return target[p];
                    }
                ])
            }

            return randomChoice([
                function () {
                    target[p] = makeProxyObject();
                    return target[p];
                },
                function () {
                    target[p] = proxyString;
                    return target[p];
                },
                function () {
                    target[p] = makeProxyArray();
                    return target[p];
                },
                function () {
                    return undefined;
                }
            ])
        },

        set: function (target, p, value, receiver) {
            target[p] = value;
            return true;
        },

        deleteProperty: function (target, p) {
            delete target[p];
            return true;
        }

    });
}
