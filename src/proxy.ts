
/**
 * 
 * This file is part of FesaJS
 *
 */

import { makeArbitraryString, randomChoice } from './helper.js';

export type ProxyString = {
    ['__tainted__']: true,
    ['__internalstr__']: string,
    ['__typeof__']: 'string'
};

export type ProxyObject = {
    ['__tainted__']: true,
    ['__internalobj__']: NodeJS.Dict<any>,
    ['__typeof__']: 'object',
    ['__ownKeys__']: any
}

export function makeProxyArray(): Array<any> {
    let array = [];
    let count = Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        array.push(randomChoice<any>([
            function () { return makeProxyObject(); },
            function () { return makeProxyString(); },
        ]));
    }
    return array;
}


export function makeProxyString(value?: string | ProxyString): ProxyString {
    let concreteVal: any = null;
    if (typeof value === 'string') {
        concreteVal = value;
    }

    return (new Proxy({}, {
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
                return concreteVal;
            }

            if (!concreteVal) {
                concreteVal = makeArbitraryString();
            }

            if (p === 'length') {
                return concreteVal.length;
            }

            else if (p === 'toString') {
                return function () {
                    return makeProxyString(concreteVal)
                }
            }

            else if (p === 'charAt') {
                return function () {
                    return String.prototype.charAt.apply(concreteVal, arguments as any);
                }
            }

            else if (p === 'substring' || p === 'replace' || p === 'toLowerCase' || p === 'toUpperCase'
                || p === 'trim' || p === 'trimLeft' || p === 'trimRight' || p === 'trimStart' || p === 'trimEnd'
                || p === 'sub' || p === 'sup') {
                return function () {
                    return makeProxyString((String.prototype[p] as Function).apply(concreteVal, arguments as any));
                }
            }

            else if (p === 'split') {
                return function () {
                    let array: Array<string | ProxyString> = String.prototype.split.apply(concreteVal, arguments as any);
                    for (let i = 0; i < array.length; i++) {
                        array[i] = makeProxyString(array[i]);
                    }
                    return array;
                }
            }

            else if (p === 'slice') {
                return function () {
                    return makeProxyString(String.prototype.slice.apply(concreteVal, arguments as any));
                }
            }

            else if (p === 'indexOf' || p === 'lastIndexOf' || p === 'includes' || p === 'startsWith') {
                return String.prototype.indexOf.apply(concreteVal, arguments as any);
            }

            else if (p === Symbol.toPrimitive) {
                return function (hint: string) {
                    if (hint === 'string') {
                        return concreteVal;
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
    })) as ProxyString;
}

/**
 * 
 * @returns a proxy `Object`
 */
export function makeProxyObject(): ProxyObject {

    return (new Proxy((function () { }) as any, {
        get: function (target, p, _) {
            // Sign of a proxy object
            if (p === '__tainted__') {
                return true;
            }

            // Return the internal `target`
            if (p === '__internalobj__') {
                return target;
            }

            // Trap typeof operator
            if (p === '__typeof__') {
                return 'object';
            }

            // Trap ownKey operator. Since the keys may be tainted (a ProxyString), we do not directly
            // trap ownKey in ProxyHandler
            if (p === '__ownKeys__') {
                let keys: any[] = Object.keys(target);
                if (keys.length === 0) {
                    return randomChoice([
                        function () { return []; },
                        function () {
                            let arbitraryString = makeArbitraryString();
                            target[Symbol.for(`__tainted__${arbitraryString}`)] = randomChoice<any>(
                                [
                                    function () { return makeProxyObject(); },
                                    function () { return makeProxyString(); },
                                    function () { return makeProxyArray(); }
                                ]
                            );
                            return [makeProxyString(arbitraryString)];
                        }
                    ])
                }
                for (let [idx, elem] of keys.entries()) {
                    keys[idx] = makeProxyString(elem);
                }
                return keys;
            }

            if (p === Symbol.toPrimitive) {
                return function () {
                    throw new Error('Unexpected hint for object.');
                }
            }

            if (Object.hasOwn(target, p)) {
                return target[p];
            }

            if (typeof p === 'string' && Object.hasOwn(target, Symbol.for(`__tainted__${p}`))) {
                return target[Symbol.for(`__tainted__${p}`)];
            }

            return randomChoice([
                function () {
                    target[p] = makeProxyObject();
                    return target[p];
                },
                function () {
                    target[p] = makeProxyString();
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

    })) as ProxyObject;
}
