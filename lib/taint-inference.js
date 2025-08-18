/**
 * 
 * This file is part of FesaJS
 * 
 */

const { generateInputTemplate } = require('./skeleton');
const generateStringTemplate = require('./template');

/**
 * 
 * @param {Function} f instrumented function with taint information
 * @param {Array<Object>} skeleton to generated skeleton for arguments from 
 * the forced execution
 */
function inference(f, skeleton) {
    generateInputTemplate(skeleton);
}

/**
 * Replace the string values in a template object
 * @param {*} obj 
 */
function findPatterns(obj) {
    if (typeof obj === 'string') {
        return findPatternStrings(obj);
    }

    if (typeof obj === 'object') {
        let p = [];
        for (let [k, v] of Object.entries(obj)) {
            p = p.concat(findPatternStrings(k)).concat(findPatterns(v));
        }
        return p;
    }
    
    return [];
}

function findPatternStrings(s) {
    let p = 0;
    while (p < s.length) {
        let idx = s.indexOf('{', p);
        if (idx === -1) {
            return [];
        }
        if (s[idx - 1] === '\\') {
            p = idx + 1;
            continue;
        } else {
            p = idx;
            break;
        }
    }
    
    if (p === s.length) {
        return [];
    }

    let q = p;
    while (q < s.length) {
        let idx = s.indexOf('}', q);
        if (idx === -1) {
            throw new Error('Not a pattern string.');
        }
        if (s[idx - 1] === '\\') {
            q = idx + 1;
            continue;
        } else {
            q = idx;
            break;
        }
    }

    if (q === s.length) {
        throw new Error('Not a pattern string.');
    }

    return [s.substring(p, q + 1)].concat(findPatternStrings(s.substring(q + 1)));
}