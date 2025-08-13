
/**
 * 
 * This file is part of FesaJS
 *
 */

'use strict';
/* Helper functions for FesaJS  */

function makeArbitraryString() {
    let length = Math.floor(Math.random() * 10);
    let str = '';
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
    }
    return str;
}

function makeArbitraryNumber() {
    return randomChoice(
        function() {
            return Math.floor(Math.random() * 10);
        },
        function() {
            return Math.floor(Math.random() * 100);
        },
        function() {
            return Math.floor(Math.random() * 1000);
        },
        function() {
            return Math.floor(Math.random() * 10000);
        },
        function() {
            return Math.floor(Math.random() * 100000);
        },
    )
}

function makeRandomId() {
    return makeArbitraryString(5);
}

function randomChoice(funcs) {
    let idx = Math.floor(Math.random() * funcs.length);
    return funcs[idx]();
}

module.exports = { makeArbitraryString, makeArbitraryNumber, makeRandomId, randomChoice };