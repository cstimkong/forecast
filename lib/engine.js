/**
 * 
 * This file is part of FesaJS
 * 
 */

'use strict';

const { makeProxyArray, makeProxyString, makeProxyObject } = require('./proxy');
const { generateTemplateString } = require('./template');
const { instrumentCodeWithTaints } = require('./instrumentation');
const { randomChoice } = require('./helper');
const { solve } = require('./staticanalysis');
const { objectHash } = require('object-hash');
const loadNodeJSModule = require('./loadmodule');

const MAX_FORCED_EXECUTION_COUNT = 1000;
const MAX_TEMPLATE_COUNT = 100;

/**
 * 
 * Generate the skeleton of the input from the results after forced execution
 * @private
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
        for (let k of Object.getOwnPropertyNames(internalObj).concat(Object.getOwnPropertySymbols(internalObj))) {
            let s = generateSkeleton(internalObj[k]);
            ret.properties[k] = s;
        }
        
        return ret;
    }
}



/**
 * @private
 * @param {Function} func the instrumented function to be used in forced execution
 * @param {Object} thisArg thisArg in execution
 */
function preAnalysis(func, thisArg) {
    let skeletenArrayHashMap = {};
    let totalRuntimeHints = {};
    for (let i = 0; i < MAX_FORCED_EXECUTION_COUNT; i++) {
        try {
            let [argArray, runtimeHints] = forcedExecution(func, Math.floor(Math.random() * 6), thisArg);
            for (let h of runtimeHints) {
                let hash = objectHash(h);
                totalRuntimeHints[hash] = h;
            }
            let skeletonArray = [];
            for (let e of argArray) {
                skeletonArray.push(generateSkeleton(e));
            }
            let hash = objectHash(skeletonArray);
            skeletenArrayHashMap[hash] = skeletonArray;
        } catch (e) {
            // Do nothing
        }
    }
    
    let templateArgArrayHashMap = {};
    for (let skeletonArray of Object.values(skeletenArrayHashMap)) {
        for (let i = 0; i < MAX_TEMPLATE_COUNT; i++) {
            let templateArgs = [];
            for (let e of skeletonArray) {
                templateArgs.push(generateInputTemplate(e));
            }
            let hash = objectHash(templateArgs);
            templateArgArrayHashMap[hash] = templateArgs;
        }
    }

    return [Object.values(templateArgArrayHashMap), Object.values(totalRuntimeHints)];
}


/**
 * 
 * Generate the input template from the skeleton. The strings are templates
 * rather than concrete strings.
 * @param {Object} skeleton 
 */
function generateInputTemplate(skeleton) {
    if (skeleton.type === 'string') {
        return generateTemplateString('any');
    }

    if (skeleton.type === 'object') {
        let o = {};
        for (let p in skeleton.properties) {
            o[p] = generateInputTemplate(skeleton.properties[p]);
        }
        
        for (let p of Object.getOwnPropertySymbols(skeleton.properties)) {
            if (skeleton.properties[p].description.startsWith('__tainted__')) {
                o[generateTemplateString('any')] = generateInputTemplate(skeleton.properties[p]);
            }
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


/**
 * 
 * @param {Function} f instrumented function with `taint information`
 * @param {Array<Object>} templateArgArray to generated skeleton for arguments from 
 * the forced execution
 * @returns {Boolean} whether the input pattern can be accepted
 */
function checkTemplateArgArray(f, templateArgArray, thisArg) {
    let argArray = [];
    let totalPatternMap = {}
    for (let [k, obj] of Object.entries(templateArgArray)) {
        let patternMap = getPatternMap(obj);
        for (let p in patternMap) {
            totalPatternMap[p] = patternMap[p];
        }
        let newObj = replacePatterns(obj, patternMap);
        argArray.push(newObj);
    }

    let runtimeHints = [];
    globalThis.__record__ = function(start, end, filename, content) {
        runtimeHints.push({ start, end, filename, content });
    };

    f.apply(thisArg, argArray);
    let taintedPatterns = new Set();
    for (let h of runtimeHints) {
        if (h.content.type === 'taintValue') {
            for (let [k, v] of Object.entries(totalPatternMap)) {
                if (v === h.content.value) {
                    taintedPatterns.add(k);
                }
            }
        }
    }

    return (taintedPatterns.size() === Object.keys(totalPatternMap).length);

}

/**
 * @private
 * @param {Object} obj 
 * @param {*} patternMap 
 * @returns 
 */
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

/**
 * @private
 * @param {Object} obj 
 * @returns 
 */
function getPatternMap(obj) {
    let patterns = findPatterns(obj);
    let patternMap = {};
    for (let p of patterns) {
        patternMap[p] = makeArbitraryString();
    }
    return patternMap;
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

/**
 * @private
 * @param {String} s the input string
 * @returns 
 */
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


/**
 * Forcefully execute a function. The executed function should be instrumented first.
 * 
 * @param {Function} f function to be execute
 * @param {Number} argCount number of arguments
 * @param {any} thisArg `this` in the function execution (optional). `thisArg` should be 
 * retrieved in other forced executions (typically as the return object).
 */
function forcedExecution(f, argCount, thisArg) {
    let argArray = [];
    for (let i = 0; i < argCount; i++) {
        argArray.push(randomChoice([
            function() { return makeProxyObject(); },
            function() { return makeProxyString(); },
            function() { return makeProxyArray(); },
            function() { return undefined; },
            function() { return null; },
        ]));
    }
    try {
        let runtimeHints = [];
        globalThis.__record__ = function(start, end, filename, content) {
            runtimeHints.push({ start, end, filename, content });
        };
        globalThis.__getdeflocation__ = __getdeflocation__;
        f.apply(thisArg, argArray);
        return [argArray, runtimeHints];
    } catch (e) {
        throw new Error(`Error in forced execution: ${e.message}`);
    } finally {
        delete globalThis.__record__;
        delete globalThis.__getdeflocation__;
    }
}


/**
 * 
 * Implementation of __getdeflocation__ in the instrumented code
 *
 * @private
 * @param {Function} f input function
 */
function __getdeflocation__(f) {
    if (f.__deflocation__) {
        return f.__deflocation__;
    }

    let descriptors = Object.getOwnPropertyDescriptors(String.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `String.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Object.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Object.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Array.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Number.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Number.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Date.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Date.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(RegExp.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `RegExp.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Set.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Set.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Map.prototype);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Map.prototype.${k}` };
        }
    }

    descriptors = Object.getOwnPropertyDescriptors(Math);
    for (let [k, v] of Object.entries(descriptors)) {
        if (typeof v.value === 'function' && f === v.value) {
            return { internalFunc: `Math.${k}` };
        }
    }

    if (f === encodeURI) {
        return { internalFunc: 'encodeURI' };
    }

    if (f === decodeURI) {
        return { internalFunc: 'decodeURI' };
    }

    if (f === encodeURIComponent) {
        return { internalFunc: 'encodeURIComponent' };
    }

    if (f === decodeURIComponent) {
        return { internalFunc: 'decodeURIComponent' };
    }

    if (f === parseInt) {
        return { internalFunc: 'parseInt' };
    }
    
    if (f === parseFloat) {
        return { internalFunc: 'parseFloat' };
    }

    if (f === JSON.stringify) {
        return { internalFunc: 'JSON.stringify' };
    }

    if (f === JSON.parse) {
        return { internalFunc: 'JSON.parse' };
    }

    if (f.toString().indexOf('{ [native code] }') >= 0) {
        return { internalFunc: 'unknown' };
    }
    
}

function __getcreationlocation__(obj) {
    if (typeof obj === 'object' && obj !== null && obj.__tainted__) {
        return 'tainted';
    }

    if (Object.hasOwn(obj, '__creationlocation__')) {
        let d = Object.assign({}, obj.__creationlocation__);
        d.prototype = (function(x) {
            if (x === Object.prototype) {
                return 'Object.prototype';
            }
            if (x === null) {
                return null;
            }
            if (x === String.prototype || x === Number.prototype) {
                throw new Error('String or number cannot have prototype hints.');
            }
            return 'unknown';
        })(Object.getPrototypeOf(obj));
        return d;
    }

    return undefined;
}

function collectTaintInfo(ast) {
    // TODO
}

function getFunctionByName(lib, name) {
    // TODO
}

/**
 * Main process
 * @param {String} modulePath 
 * @param {Object} opts 
 */
function mainProcess(modulePath, opts) {
    
    let [lib, sourceFiles] = loadNodeJSModule(modulePath);
    
    let funcs = [];
    if (typeof lib === 'function') {
        funcs.push({func: lib, name: '<root>', _this: undefined});
    }
    for (let k in lib) {
        if (typeof lib[k] === 'function') {
            funcs.push({func: lib[k], name: `<root>.${k}`, _this: undefined});
        }
    }

    let totalRuntimeHints = {};
    let totalTemplateArgArrays = {};
    for (let [f, functionName, _this] of funcs) {
        let [templateArgArrays, runtimeHints] = preAnalysis(f, _this);
        totalTemplateArgArrays[functionName] = templateArgArrays;
        for (let h of runtimeHints) {
            totalRuntimeHints[objectHash(h)] = h;
        }
    }

    let modifiedAst = solve(sourceFiles, Object.values(totalRuntimeHints));
    let taintInfo = collectTaintInfo(modifiedAst);

    let [newLib, _] = loadNodeJSModule(modulePath, taintInfo);
    for (let [_, funcname, _this] of funcs) {
        // TODO: if f is tainted
        let f = getFunctionByName(newLib, funcname);
        for (let templateArgArray of totalTemplateArgArrays[funcname]) {
            if (checkTemplateArgArray(f, templateArgArray, _this)) {
                // TODO: generate exploit
            }
        }
    }
    
}

module.exports = mainProcess;