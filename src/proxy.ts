/**
 * 
 * This file is part of Forecast.
 */

import { randomChoice } from './helper.js';

import { defaultOptionValues } from './defaults.js';

const PROXY_STRING_LITERAL = defaultOptionValues.proxyStringLiteral;

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
            return PROXY_STRING_LITERAL;
        },
        __TYPEOF__: 'string',
        get __INTERNAL__() {
            return proxyString;
        },
        [Symbol.toStringTag]: 'String'
    };

    for (let m of ['charAt', 'substring', 'slice', 'replace', 'trim', 'trimLeft', 'trimRight', 'toUpperCase', 'toLowerCase', 'toLocaleUpperCase', 'toLocaleLowerCase', 'toString', 'replace']) {
        o[m] = function() {
            return o;
        }
    }

    for (let m of ['indexOf', 'lastIndexOf']) {
        o[m] = function() {
            if ((globalThis as any).__strop) {
                ((globalThis as any).__strop as Array <any>).push({call: m, args: [arguments[0]]});
            }
            return randomChoice([
                function() { return 0; },
                function() { return -1; }
            ])
        }
    }

    for (let m of ['startsWith', 'endsWith', 'match']) {
        o[m] = function() {
            if ((globalThis as any).__strop) {
                ((globalThis as any).__strop as Array <any>).push({call: m, args: [arguments[0]]});
            }
            return randomChoice([
                function() { return true; },
                function() { return false; }
            ])
        }
    }

    o['split'] = function() {
        if ((globalThis as any).__strop) {
            ((globalThis as any).__strop as Array <any>).push({call: 'split', args: [arguments[0]]});
        }
        return randomChoice([
            function() { return [o]},
            function() { return [o, o]},
            function() { return [o, o, o]}
        ]);
    }
    return o;
})();


/**
 * 
 * @returns a proxy `Object`
 */
export function makeProxyObject() {

    return new Proxy((function () { }) as any, {
        get: function (target, p, _) {
            if (Object.prototype.hasOwnProperty(p)) {
                return (Object.prototype as any)[p];
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

            if (p === PROXY_STRING_LITERAL) {
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
        },

        ownKeys: function(target) {
            let keys = Object.keys(target);
            if (keys.length === 0) {
                return randomChoice([
                    function() { return Reflect.ownKeys(target) },
                    function() {
                        target[PROXY_STRING_LITERAL] = randomChoice([
                            function() { return makeProxyObject(); },
                            function() { return makeProxyArray(); },
                            function() { return proxyString; },
                            function() { return null; }
                        ]);
                        return Reflect.ownKeys(target);
                    }
                ]);
            } else {
                return Reflect.ownKeys(target);
            }
            
        }

    });
}

export function hasProxyStringProperty(obj: any) {
    if (typeof obj === 'object' && obj !== null)
        return Object.hasOwn(obj, PROXY_STRING_LITERAL);

    return false;
}

/**
 * 
 * Make a copy of the proxy object and let it fixed.
 */
export function toFixedValue(obj: any): any {
    if (obj === proxyString) {
        return proxyString;
    }

    else if (obj !== null && obj !== undefined && obj.__INTERNAL__) {
        let __internal = obj.__INTERNAL__;
        let o: any = {};
        for (let x of Object.keys(__internal)) {
            o[x] = toFixedValue(__internal[x]);
        }
        return o;
    }

    else if (Array.isArray(obj)) {
        let l = [];
        for (let x of obj) {
            l.push(toFixedValue(x));
        }
        return l;
    }

    else if (typeof obj === 'object' && obj !== null) {
        for (let x of Object.keys(obj)) {
            obj[x] = toFixedValue(obj[x]);
        }
        return obj;
    }

    return obj;
}