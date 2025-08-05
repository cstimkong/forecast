
/**
 * 
 * This file is part of FesaJS.
 */

const codeInstrumentation = require('./code-instrumentation');

const supportedGrammars = ['normalstring', 'filepath', 'url', 'xml', 'json', 'regex', 'querystring'];
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
        return 'http://' + makeArbitraryString() + '/' +  makeArbitraryString();
    }
    if (supportedGrammars[c] === 'querystring') {
        return makeArbitraryString() + '=' + makeArbitraryString()
    }
    return makeArbitraryString();
    
}

function makeRandomArray() {
    let array = [];
    let count = Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        array.push(makeProxyObject());
    }
    return array;
}


function makeProxyObject(value) {
    let stringValue = null;
    let arrayValue = null;
    if (typeof value === 'string') {
        stringValue = value;
    }

    return new Proxy(function() { }, {
        get: function(target, p, receiver) {

            /* Process special properties first */

            if (p === '__tainted__') {
                return true;
            }

            if (p === 'slice') {
                if (stringValue) {
                    return function() {
                        return makeProxyObject(
                            String.prototype.slice.apply(stringValue, arguments)
                        );
                    };
                }
                else if (arrayValue) {
                    return function() {
                        return Array.prototype.slice.apply(arrayValue, arguments)
                    }
                }
                else {
                    return randomChoice(
                        [
                            function() { return makeProxyObject(); },
                            function() { 
                                stringValue = makeRandomString();
                                return function() {
                                    return makeProxyObject(
                                        String.prototype.slice.apply(stringValue, arguments)
                                    );
                                }
                            },
                            function() { 
                                arrayValue = makeRandomArray();
                                return function() {
                                    return Array.prototype.slice.apply(arrayValue, arguments)
                                }
                            }
                        ]
                    )
                }
                
            }

            if (p === 'length') {
                if (stringValue) {
                    return stringValue.length;
                } else if (arrayValue) {
                    return arrayValue.length;
                } else {
                    return randomChoice([
                        function() {
                            return undefined;
                        },
                        function() {
                            stringValue = makeRandomString();
                            return stringValue.length;
                        },
                        function() {
                            arrayValue = makeRandomArray();
                            return arrayValue.length;
                        }
                    ]);
                }
            }

            if (p === 'shift' || p === 'pop' || p === 'push' || p === 'unshift') {
                if (arrayValue) {
                    return function() {
                        return Array.prototype[p].apply(arrayValue, arguments);
                    };
                }
                else if (stringValue) {
                    return undefined;
                }
                else {
                    return randomChoice([
                        function() { return undefined; },
                        function() { 
                            arrayValue = makeRandomArray();
                            return function() {
                                Array.prototype[p].apply(arrayValue, arguments);
                            }
                        }
                    ]);
                }
            }

            if (p === 'charAt') {
                if (stringValue) {
                    return function() {
                        return String.prototype.charAt.apply(stringValue, arguments);
                    };
                } else {
                    return randomChoice([
                        function() { return undefined; },
                        function() { 
                            stringValue = makeRandomString();
                            return function() {
                                return stringValue.charAt.apply(stringValue, arguments);
                            }
                        }
                    ]);
                }
            }
            
            if (p === 'substring' || p === 'replace' || p === 'toLowerCase' || p === 'toUpperCase') {
                if (stringValue) {
                    return function() {
                        return makeProxyObject(
                            String.prototype.substring.apply(stringValue, arguments)
                        );
                    };
                } else {
                    return randomChoice([
                        function() { return undefined; },
                        function() { 
                            stringValue = makeRandomString();
                            return function() {
                                return makeProxyObject(
                                    String.prototype.substring.apply(stringValue, arguments)
                                );
                            }
                        }
                    ])
                }
            }

            if (p === 'split') {
                if (stringValue) {
                    return function() {
                        let array = String.prototype.split.apply(stringValue, arguments);
                        for (let i = 0; i < array.length; i++) {
                            array[i] = makeProxyObject(array[i]);
                        }
                        return array;
                    }
                }
                else {
                    return randomChoice([
                        function() { return undefined; },
                        function() {
                            stringValue = makeRandomString();
                            return function() {
                                let array = String.prototype.split.apply(stringValue, arguments);
                                for (let i = 0; i < array.length; i++) {
                                    array[i] = makeProxyObject(array[i]);
                                }
                                return array;
                            }
                        }
                    ]);
                }
            }

            if (p === 'toString') {
                if (stringValue) {
                    return function() {
                        return makeProxyObject(stringValue);
                    }
                } else {
                    return '';
                }
            }

            if (p === Symbol.toPrimitive) {
                return function(hint) {
                    if (hint === 'string') {
                        if (stringValue) {
                            return stringValue;
                        } else {
                            return '[object Object]';
                        }
                    }
                }
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
                    return undefined;
                }
            ])
        },

        set: function(target, p, value, receiver) {
            
        }

    })
}
/**
 * The executed function should be instrumented first
 */
function forcedExecution(f, argCount) {
    let argArray = [];
    for (let i = 0; i < argCount; i++) {
        argArray.push(makeProxyObject());
    }
    
    f.apply(undefined, argArray);
}

let {set} = require('json-pointer');
let successCount = 0;
for (let i = 0; i < 1000000; i++) {
    try {
        forcedExecution(set, 3);
        successCount += 1;
    } catch (e) {
        console.error(e.message);
    }
}

console.log('Success count:', successCount);
