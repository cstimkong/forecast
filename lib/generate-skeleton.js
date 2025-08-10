/**
 * This file is part of FesaJS
 */

'use strict';

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
    }
}

module.exports = generateSkeleton;