

import { makeProxyString } from '../proxy';

/**
 *  Mocked `encodeURI` function
 */
export function __encodeURI__(uri) {
    if (typeof uri === 'string') {
        return encodeURI(uri);
    }
    if (typeof uri === 'object' && uri.__typeof__ === 'string') {
        return makeProxyString(encodeURI(uri.__internalstr__));
    }

    throw new Error('URI should be a string.');
}

/**
 * Mocked `decodeURI` function
 */
export function __decodeURI__(encodedURI) {
    if (typeof encodedURI === 'string') {
        return decodeURI(encodedURI);
    }
    if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
        return makeProxyString(decodeURI(encodedURI.__internalstr__));
    }

    throw new Error('URI should be a string.');
}


export function __encodedURIComponent__(uri) {
    if (typeof uri === 'string') {
        return encodeURIComponent(uri);
    }
    if (typeof uri === 'object' && uri.__typeof__ === 'string') {
        return makeProxyString(encodeURIComponent(uri.__internalstr__));
    }

    throw new Error('URI should be a string.');
}

/**
 * Mocked `decodeURIComponent` function
 */
export function __decodeURIComponent__(encodedURI) {
    if (typeof encodedURI === 'string') {
        return decodeURIComponent(encodedURI);
    }
    if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
        return makeProxyString(decodeURIComponent(encodedURI.__internalstr__));
    }

    throw new Error('URI should be a string.');
}

export const __JSON__ = {
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
