/**
 * 
 * This file is part of FesaJS
 */

import { makeProxyString } from './proxy';

export let globalObject = {
    encodeURI: function (uri) {
        if (typeof uri === 'string') {
            return encodeURI(uri);
        }
        if (typeof uri === 'object' && uri.__typeof__ === 'string') {
            return makeProxyString(encodeURI(uri.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    decodeURI: function (encodedURI) {
        if (typeof encodedURI === 'string') {
            return decodeURI(encodedURI);
        }
        if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
            return makeProxyString(decodeURI(encodedURI.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    encodeURIComponent: function (uri) {
        if (typeof uri === 'string') {
            return encodeURIComponent(uri);
        }
        if (typeof uri === 'object' && uri.__typeof__ === 'string') {
            return makeProxyString(encodeURIComponent(uri.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    decodeURIComponent: function (encodedURI) {
        if (typeof encodedURI === 'string') {
            return decodeURIComponent(encodedURI);
        }
        if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
            return makeProxyString(decodeURIComponent(encodedURI.__internalstr__));
        }

        throw new Error('URI should be a string.');
    },
    JSON: {
        parse(_) {
            let obj = JSON.parse.apply(undefined, arguments);
            return (function _replace(o) {
                if (typeof o === 'string') {
                    return makeProxyString(o);
                }

                if (typeof o === 'object' && o !== null) {
                    let x = {};
                    for (let p in o) {
                        x[Symbol.for(`__tainted__${p}`)] = _replace(o[p]);
                    }
                    return x;
                }

                return o;

            })(obj);

        },

        stringify(obj) {
            return JSON.stringify(obj);
        }
    }
}
