
/**
 * 
 * This file is part of FesaJS.
 */

const {makeProxyArray, makeProxyString, makeProxyObject} = require('./proxy');

const {makeArbitraryString} = require('./random-helper');

const supportedGrammars = ['normalstring', 'filepath', 'url', 'xml', 'json', 'regex', 'querystring', 'yaml'];

function randomSelect(arr) {
    let idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}

function randomChoice(funcs) {
    let idx = Math.floor(Math.random() * funcs.length);
    return funcs[idx]();
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
            function() { return undefined; }
        ]));
    }
    
    f.apply(thisArg, argArray);
}

module.exports = forcedExecution;