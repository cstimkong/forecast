

const { makeProxyString } = require('../proxy');

/**
 *  Mocked `encodeURI` function
 */
function __encodeURI__(uri) {
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
function __decodeURI__(encodedURI) {
    if (typeof encodedURI === 'string') {
        return decodeURI(encodedURI);
    }
    if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
        return makeProxyString(decodeURI(encodedURI.__internalstr__));
    }

    throw new Error('URI should be a string.');
}


function __encodedURIComponent__(uri) {
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
function __decodeURIComponent__(encodedURI) {
    if (typeof encodedURI === 'string') {
        return decodeURIComponent(encodedURI);
    }
    if (typeof encodedURI === 'object' && encodedURI.__typeof__ === 'string') {
        return makeProxyString(decodeURIComponent(encodedURI.__internalstr__));
    }

    throw new Error('URI should be a string.');
}

const __JSON__ = {
    parse(_) {
        let obj = JSON.parse.apply(undefined, arguments);
        return (function _replace(o) {
            // TODO
        })(obj);
        
    },

    stringify(obj) {
        return JSON.stringify(obj);
    }
}

module.exports = { __encodeURI__, __encodedURIComponent__, __decodeURI__, __decodeURIComponent__, __JSON__ };