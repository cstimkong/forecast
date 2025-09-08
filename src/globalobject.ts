/**
 * 
 * This file is part of FesaJS
 */

import { makeProxyString, ProxyString } from './proxy.js';

export let globalObject = {
    encodeURI: function (uri: string | ProxyString) {
        if (typeof uri === 'string') {
            return encodeURI(uri);
        }
        if (typeof uri === 'object' && uri.__typeof__ === 'string') {
            return makeProxyString(encodeURI(uri.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    decodeURI: function (encodedURI: string | ProxyString) {
        if (typeof encodedURI === 'string') {
            return decodeURI(encodedURI);
        }
        if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
            return makeProxyString(decodeURI(encodedURI.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    encodeURIComponent: function (uri: string | ProxyString) {
        if (typeof uri === 'string') {
            return encodeURIComponent(uri);
        }
        if (typeof uri === 'object' && uri.__typeof__ === 'string') {
            return makeProxyString(encodeURIComponent(uri.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    decodeURIComponent: function (encodedURI: string | ProxyString) {
        if (typeof encodedURI === 'string') {
            return decodeURIComponent(encodedURI);
        }
        if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
            return makeProxyString(decodeURIComponent(encodedURI.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    escape: function(s: string) {
        return globalObject.decodeURI(s);
    },
    JSON: {
        parse(_: any) {
            let obj = JSON.parse.apply(undefined, arguments as any);
            return (function _replace(o) {
                if (typeof o === 'string') {
                    return makeProxyString(o);
                }

                if (typeof o === 'object' && o !== null) {
                    let x: any = {};
                    for (let p in o) {
                        if (typeof p === 'string')
                            x[Symbol.for(`__tainted__${p}`)] = _replace(o[p]);
                    }
                    return x;
                }

                return o;

            })(obj);

        },

        stringify(obj: any) {
            return JSON.stringify(obj);
        }
    }
}
