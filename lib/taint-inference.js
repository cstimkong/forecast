/**
 * 
 * This file is part of FesaJS
 * 
 */

const { makeArbitraryString } = require('./helper');
const generateStringTemplate = require('./template');

/**
 * 
 * @param {Function} f instrumented function with taint information
 * @param {Array<Object>} objsWithPatterns to generated skeleton for arguments from 
 * the forced execution
 */
function inference(f, objsWithPatterns, thisArg) {
    for (let obj of objsWithPatterns) {
        // TODO
    }
}

function replacePatterns(obj, patternMap) {
    if (typeof obj === 'string') {
        for (let [k, v] of Object.entries(patternMap)) {
            obj = obj.replace(k, v);
        }
        return obj;
    }

    if (typeof obj === 'object') {
        let newObj = {};
        for (let k in obj) {
            let v = replacePatterns(obj[k]);
            newObj[replacePatterns(k)] = v;
        }
        return newObj;
    }

    return obj;
}

function fillPatterns(obj) {
    let patterns = findPatterns(obj);
    let patternMap = {};
    for (let p of patterns) {
        patternMap[p] = makeArbitraryString();
    }
    return [obj, patternMap];
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