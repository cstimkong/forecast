/**
 * This file is part of FesaJS
 */

'use strict';

const { randomChoice, makeRandomId } = require('./random-helper');

/**
 * Generate the skeleton of the input from the results after forced execution
 * @param {Object} obj proxy input after the forced execution
 * @returns the object representing the skeleton
 */
function generateSkeleton(obj) {
    if (typeof obj === 'string') {
        return 'string';
    }

    if (typeof obj === 'object' && obj instanceof Array) {
        let ret = {type: 'array', elements: []};
        for (let x of obj) {
            ret.elements.push(generateSkeleton(x));
        }
        return ret;
        
    }

    if (typeof obj === 'object' && obj !== null && obj.__string__) {
        return {type: 'string'};
    }

    if (typeof obj === 'object' && obj !== null) {
        let internalObj = obj.__internalobj__;
        let ret = {type: 'object', properties: {}};
        for (let k in internalObj) {
            let s = generateSkeleton(internalObj[k]);
            ret.properties[k] = s;
        }
        return ret;
    }

}

/**
 * 
 * @param {String | Array<String>} grammarType 
 * @returns 
 */
function generateStringTemplate(grammarType) {
    if (Array.isArray(grammarType)) {
        let funcs = [];
        for (let t of grammarType) {
            funcs.push(function() { return generateStringTemplate(t); });
        }
        return randomChoice(funcs);
    }

    if (grammarType === 'normalstring') {
        return `{${makeRandomId()}}`;
    }

    else if (grammarType === 'url') {
        return randomChoice([
            function() {
                return `http://{${makeRandomId()}}/{${makeRandomid()}}`;
            },
            function() {
                return `file:///{${makeRandomId()}}/{${makeRandomId()}}/{${makeRandomId()}}`;
            },
            function() {
                return `http://{${makeRandomId()}}/{${makeRandomid()}}?{${generateStringTemplate('querystring')}}`;
            }
        ]);
    }

    else if (grammarType === 'querystring') {
        return randomChoice([
            function() {
                return `{${makeRandomId()}}={${makeRandomId()}}&{${makeRandomId()}}={${makeRandomId()}}`;
            }
        ])
    }
    else if (grammarType === 'filepath') {
        return randomChoice([
            function() {
                return `/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}`;
            },
            function() {
                return `/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}/`;
            }
        ])
    }

}



module.exports = generateSkeleton;