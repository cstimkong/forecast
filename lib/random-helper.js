
/**
 * 
 * This file is part of FesaJS
 *
 */


function makeArbitraryString() {
    let length = Math.floor(Math.random() * 10);
    let str = '';
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
    }
    return str;
}

module.exports = {makeArbitraryString};