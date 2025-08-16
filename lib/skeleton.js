/**
 * This file is part of FesaJS
 */

'use strict';

const { randomChoice, makeRandomId, makeArbitraryString } = require('./helper');
const generateTemplateString = require('./template');

/**
 * Generate the skeleton of the input from the results after forced execution
 * @param {Object} obj proxy input after the forced execution
 * @returns the object representing the skeleton
 */
function generateSkeleton(obj) {
    if (typeof obj === 'string' || typeof obj === 'number' || obj === undefined || obj === null) {
        return {type: 'primitive', value: obj};
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
 * Generate the input template from the skeleton. The strings are templates
 * rather than concrete strings.
 * @param {Object} skeleton 
 */
function generateInputTemplate(skeleton) {
    if (skeleton.type === 'string') {
        return generateTemplateString(['filepath', 'normalstring', 'surroundedtext', 'xml', 'json']);
    }

    if (skeleton.type === 'object') {
        let o = {};
        for (let p in skeleton.properties) {
            o[p] = generateInputTemplate(skeleton.properties[p]);
        }
        return o;
    }

    if (skeleton.type === 'array') {
        let arr = [];
        for (let e of skeleton.elements) {
            arr.push(generateInputTemplate(e));
        }
        return arr;
    }

    if (skeleton.type === 'primitive') {
        return skeleton.value;
    }
}

module.exports = {generateSkeleton, generateInputTemplate};