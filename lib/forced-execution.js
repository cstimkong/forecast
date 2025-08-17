
/**
 * 
 * This file is part of FesaJS.
 */

'use strict';

const { makeProxyArray, makeProxyString, makeProxyObject } = require('./proxy');

const { makeArbitraryString, randomChoice } = require('./helper');

const supportedGrammars = ['normalstring', 'filepath', 'url', 'xml', 'json', 'regex', 'querystring', 'yaml'];


/**
 * Implementation of __getdeflocation__ in the instrumented code
 *
 */
function __getdeflocation__(f) {
    if (f.__deflocation__) {
        return f.__deflocation__;
    }

    let descriptors = Object.getOwnPropertyDescriptors(String.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `String.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Object.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Object.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Array.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Number.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Number.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Date.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Date.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(RegExp.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `RegExp.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Set.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Set.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Map.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Map.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Math);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Math.${k}` };
        }
    }

    if (f === encodeURI) {
        return { internalFunc: 'encodeURI' };
    }

    if (f === decodeURI) {
        return { internalFunc: 'decodeURI' };
    }

    if (f === encodeURIComponent) {
        return { internalFunc: 'encodeURIComponent' };
    }

    if (f === decodeURIComponent) {
        return { internalFunc: 'decodeURIComponent' };
    }

    if (f === parseInt) {
        return { internalFunc: 'parseInt' };
    }
    
    if (f === parseFloat) {
        return { internalFunc: 'parseFloat' };
    }

    if (f === JSON.stringify) {
        return { internalFunc: 'JSON.stringify' };
    }

    if (f === JSON.parse) {
        return { internalFunc: 'JSON.parse' };
    }

    if (f.toString().indexOf('{ [native code] }') >= 0) {
        return { internalFunc: 'unknown' };
    }
    
}
/**
 * Forcefully execute a function. The executed function should be instrumented first.
 * 
 * @param {Function} f function to be execute
 * @param {Number} argCount number of arguments
 * @param {any} thisArg `this` in the function execution (optional)
 */
function forcedExecution(f, argCount, thisArg) {
    let argArray = [];
    for (let i = 0; i < argCount; i++) {
        argArray.push(randomChoice([
            function() { return makeProxyObject(); },
            function() { return makeProxyString(); },
            function() { return makeProxyArray(); },
            function() { return undefined; },
            function() { return null; },
        ]));
    }
    
    f.apply(thisArg, argArray);
}

module.exports = forcedExecution;