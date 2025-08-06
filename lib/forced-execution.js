
/**
 * 
 * This file is part of FesaJS.
 */

const codeInstrumentation = require('./code-instrumentation');

const supportedGrammars = ['normalstring', 'filepath', 'url', 'xml', 'json', 'regex', 'querystring'];

function randomSelect(arr) {
    let idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}

function randomChoice(funcs) {
    let idx = Math.floor(Math.random() * funcs.length);
    return funcs[idx]();
}

function makeArbitraryString() {
    let length = Math.floor(Math.random() * 10);
    let str = '';
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
    }
    return str;
}

function makeRandomString() {
    let c = Math.floor(Math.random() * supportedGrammars.length);
    if (supportedGrammars[c] === 'filepath') {
        let componentCount = Math.floor(Math.random() * 10);
        let s = ''
        for (let i = 0; i < componentCount; i++) {
            s += '/' + makeArbitraryString();
        }
        return s;
    }
    if (supportedGrammars[c] === 'url') {
        return `${randomSelect(['http', 'https', 'file'])}://${makeArbitraryString()}/${makeArbitraryString()}`;
    }

    if (supportedGrammars[c] === 'querystring') {
        return makeArbitraryString() + '=' + makeArbitraryString()
    }

    if (supportedGrammars[c] === 'json') {
        return JSON.stringify({
            [makeArbitraryString()]: makeArbitraryString()
        });
    }
    if (supportedGrammars[c] === 'xml') {
        let token = makeArbitraryString();
        return `<${token}>${makeArbitraryString()}</${token}>`;
    }
    
    return makeArbitraryString();
    
}

/* Proxy functions */

function makeProxyArray() {
    let array = [];
    let count = Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        array.push(randomChoice([
            function() { return makeProxyObject(); },
            function() { return makeProxyString(); },
            // function() { return makeProxyArray(); }
        ]));
    }
    return array;
}


function makeProxyString(value) {
    let __concreteval__ = null;
    if (typeof value === 'string') {
        __concreteval__ = value;
    }
    
    return new Proxy({}, {
        get(target, p, receiver) {
            if (p === '__tainted__') {
                return true;
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

            else if (p === 'substring' || p === 'replace' || p === 'toLowerCase' || p === 'toUpperCase') {
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
                    throw new Error('Unexpected hint for string');
                }
            }

        },

        set(_) {
            return false; // prevent setting properties
        }
    });
}

function makeProxyObject() {

    return new Proxy(function() { }, {
        get: function(target, p, receiver) {

            if (p === '__tainted__') {
                return true;
            }

            if (Object.hasOwn(target, p)) {
                return target[p];
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
            for (let [idx, elem] of keys.entries()) {
                keys[idx] = makeProxyString(elem);
            }
            return keys;
        }

    })
}
/**
 * The executed function should be instrumented first
 */
function forcedExecution(f, argCount, thisArg) {
    let argArray = [];
    for (let i = 0; i < argCount; i++) {
        argArray.push(randomChoice([
            function() { return makeProxyObject(); },
            function() { return makeProxyString(); },
            function() { return makeProxyArray(); },
            function() { return undefined; }
        ]));
    }
    
    f.apply(thisArg, argArray);
}

module.exports = forcedExecution;