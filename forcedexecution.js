'use strict'
/**
 * 
 * This file is part of FesaJS framework.
 * 
 */
const process = require('process');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const fs = require('node:fs');
const deepEqual = require('deep-equal');
const {getType, getArgumentType, isCovariant} = require('./lib/utils');
const pretty = require('pino-pretty');
const pino = require('pino').default;
const logger = pino(pretty({sync: true}));

let argv = yargs().usage('Type regression testing based on a given model')
.option('library', {
    alias: 'l',
    type: 'string',
    description: 'Library name or path (override the library specified in the model)'
}).option('model', {
    alias: 'm',
    type: 'string',
    description: 'Model path'
})
.option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output location of the detection results'
})
.demandOption(['model'])
.help().parse(hideBin(process.argv));

let modelPath = argv.model;

/**
 * Construct a model tree from the generated model.
 */
function constructModelTree(modelContent) {
    let paths = modelContent.paths;
    let root = {children: [], parent: null};
    for (let [idx, {path, type}] of paths.entries()) {
        let current = root;
        let accumulatedPath = []
        for (let i = 0; i < path.length; i++) {
            accumulatedPath = accumulatedPath.concat([path[i]])
            let j = 0;
            for (; j < current.children.length; j++) {
                if (deepEqual(current.children[j].p, path[i])) {
                    break;
                }
            }
            if (j === current.children.length) {
                let newItem = {p: path[i], ap: accumulatedPath, children: [], parent: current};
                if (i === path.length - 1) {
                    newItem.type = type;
                    newItem.order = idx;
                }
                current.children.push(newItem);
                current = newItem;
            } else {
                current = current.children[j];
            }
        }
    }

    let newRhoRelations = []
    for (let [s, t] of modelContent.rhoRelations) {
        let current = root;
        for (let pathComp of s) {
            let c = undefined;
            for (let x of current.children) {
                if (deepEqual(x.p, pathComp)) {
                    c = x;
                    break;
                }
            }
            if (c === undefined) {
                throw new Error('Incorrect path.')
            }
            current = c;
        }
        let node1 = current;

        current = root;
        for (let pathComp of t) {
            let c = undefined;
            for (let x of current.children) {
                if (deepEqual(x.p, pathComp)) {
                    c = x;
                    break;
                }
            }
            if (c === undefined) {
                throw new Error('Incorrect path.');
            }
            current = c;
        }
        let node2 = current;
        newRhoRelations.push([node1, node2]);

    }

    return [root, newRhoRelations];
}

/**
 * Proxify the synthesized object for an argument node
 */
function getProxy(node, obj) {
    return new Proxy(obj, {
        get: function(target, p, receiver) {
            for (let x of node.children) {
                if (x.p.compType === 'accessProp' && x.p.propName === p) {
                    if (!x.processed) {
                        x.obj = synthesizeValue(x);
                        x.processed = true;
                    }
                    return x.obj;
                }
            }
            logger.warn({breakingPath: node.ap.concat([{compType: 'accessProp', propName: p}]), additionalProp: p})
            return null;
        },
        apply: function(target, thisArg, argArray) {
            // If the proxy wraps a function, make the function execute normally
            return target.apply(thisArg, argArray);
        }
    })
}

/**
 * Synthesize value for an argument node.
 */
function synthesizeValue(node) {
    if (node.type === 'undefined') {
        return undefined;
    }
    if (node.type === 'null') {
        return null;
    }
    if (node.type === 'object' || node.type === 'array' || node.type === 'set' || node.type === 'map' || node.type === 'boolean' || node.type === 'number' || node.type === 'string') {
        return getProxy(node, {});
    }
    if (node.type === 'function') {

        return getProxy(node, function() {
            for (let x of node.children) {
                if (x.p.compType === 'call') {
                    if (!x.processed) {
                        x.obj = synthesizeValue(x);
                        x.processed = true;
                    }
                    let argTypes = {}
                    for (let t of node.children) {
                        if (t.p.compType === 'arg' && t.p.callId === x.p.callId) {
                            argTypes[t.p.argId] = t.type;
                        }
                    }
                    argTypes.length = Object.keys(argTypes).length;
                    argTypes = Array.prototype.slice.call(argTypes);
                    let realArgumentTypes = []
                    for (let i = 0; i < arguments.length; i++) {
                        realArgumentTypes.push(isCovariant(x.ap) ? getArgumentType(arguments[i]) : getType(arguments[i]));
                    }

                    if (checkAllCompatible(realArgumentTypes, argTypes)) {
                        return x.obj;
                    }
                    
                }
            }
            logger.warn({breakingPath: node.ap.concat([{compType: 'call', callId: null}])})
            return 0;
        });

    }
    if (node.type.primType) {
        if (node.type.primType === 'number' && node.type.value === 'Infinity') {
            return Number.POSITIVE_INFINITY;
        }
        if (node.type.primType === 'number' && node.type.value === 'NaN') {
            return Number.NaN;
        }
        return node.type.value;
    }

    throw new Error('Cannot synthesize the value, type: ' + node.type);
}

/**
 * Check whether the first type is a subtype of the second type
 */
function checkCompatible(type1, type2) {
    if (type2 === null) {
        return true;
    }
    if (type2 === 'object') {
        if (type1 === 'object' || type1 === 'function' || type1 === 'map' || type1 === 'set') {
            return true;
        }
    }
    if (type2 === type1) {
        return true;
    }
    if (deepEqual(type2, type1)) {
        return true;
    }
    return false;
}

function checkAllCompatible(types1, types2) {
    for (let i = 0; i < types1.length; i++) {
        if (!checkCompatible(types1[i], types2[i])) {
            return false;
        }
    }
    return true;
}

function findNextNode(currentNode) {
    let minNode = undefined;
    for (let c of currentNode.children) {
        if (!c.processed) {
            if (!minNode) {
                minNode = c;
            } else {
                minNode = c.order < minNode.order ? c : minNode;
            }
        } else {
            let m = findNextNode(c);
            if (!m) {
                continue;
            }
            if (minNode !== undefined && m.order < minNode.order) {
                minNode = m;
            }
        }
    }
    return minNode;
}

function traverseTree(node, rhoRelations) {
    logger.info('Processing node path: ' + JSON.stringify(node.ap));

    if (node.parent === null || node.parent === undefined) {
        for (let c of node.children) {
            traverseTree(c, rhoRelations);
        }
        return;
    }

   else if (node.p.compType === 'require') {
        if (!node.processed) {
            let o = require(node.p.moduleName);
            if (!checkCompatible(getType(o), node.type)) {
                logger.warn({breakingPath: node.ap});
            }
            node.obj = o;
            node.processed = true;
        }
    }

    else if (node.p.compType === 'accessProp') {
        if (!node.processed) {
            if (!node.parent.empty) {
                if (node.parent.obj !== undefined) {
                    let o = node.parent.obj[node.p.propName];
                    let covariant = isCovariant(node.ap);
                    let type = covariant ? getType(o) : getArgumentType(o);
                    if (covariant && !checkCompatible(type, node.type)) {
                        logger.warn({breakingPath: node.ap, incompatibleTypes: {actual: type, required: node.type}});
                    }
                    node.obj = o;
                } else {
                    logger.warn({breakingPath: node.ap, reason: "get property of undefined"});
                    node.empty = true;
                }
            } else {
                node.empty = true;
            }
            node.processed = true;
        }
    }

    else if (node.p.compType === 'writeProp') {
        if (!node.processed) {
            if (!node.parent.empty) {
                if (node.parent.obj !== undefined) {
                    node.parent.obj[node.p.propName] = synthesizeValue(node);
                } else {
                    logger.warn({breakingPath: node.ap, reason: "set property of undefined"});
                    node.empty = true;
                }
            } else {
                node.empty = true;
            }
            node.processed = true;
        }
    }

    else if (node.p.compType === 'arg') {
        
        if (!node.processed) {
            let hasRhoRelationInput = false;
            let rhoRelationInput;
            for (let i = 0; i < rhoRelations.length; i++) {
                if (rhoRelations[i][1] === node) {
                    if (!rhoRelations[i][0].processed) {
                        traverseTree(rhoRelations[i][0], rhoRelations);
                    }
                    hasRhoRelationInput = true;
                    rhoRelationInput = rhoRelations[i][0].obj;
                }
            }

            if (hasRhoRelationInput) {
                node.obj = rhoRelationInput;
            } else {
                node.obj = synthesizeValue(node);
            }
            node.processed = true;
            
        }
    }

    else if (node.p.compType === 'call') {
        if (!node.processed) {
            let argArray = {};
            for (let x of node.parent.children) {
                if (x.p.compType === 'arg' && x.p.callId === node.p.callId) {
                    if (!x.processed) {
                        traverseTree(x, rhoRelations);
                    }
                    argArray[x.p.argId] = x.obj;
                }
            }
            // Convert the array-like object to a real array
            argArray.length = Object.keys(argArray).length;
            argArray = Array.prototype.slice.call(argArray);
            let thisObj = undefined;
            if (node.parent.parent !== null && node.parent.parent !== undefined && node.parent.p.compType == 'accessProp') {
                thisObj = node.parent.parent.obj;
            }
            try {
                let result = node.parent.obj.apply(thisObj, argArray);
                let type = isCovariant(node.ap) ? getType(result) : getArgumentType(result);
                if (!checkCompatible(type, node.type)) {
                    logger.warn({breakingPath: node.ap, incompatibleReturnTypes: {actual: type, required: node.type}})
                }
                node.obj = result;
                node.processed = true;
            } catch (e) {
                logger.info('Error in executing the path: ' + JSON.stringify(node.ap));
                node.processed = true;
            }
            
        }
    }

    else if (node.p.compType === 'new') {
        if (!node.processed) {
            let argArray = {};
            for (let x of node.parent.children) {
                if (x.p.compType === 'arg' && x.p.callId === node.p.callId) {
                    if (!x.processed) {
                        traverseTree(x, rhoRelations);
                    }
                    argArray[x.p.argId] = x.obj;
                }
            }
            // Convert the array-like object to a real array
            argArray.length = Object.keys(argArray).length;
            argArray = Array.prototype.slice.call(argArray);
            try {
                let result = Reflect.construct(node.parent.obj, argArray);
                let type = isCovariant(node.ap) ? getType(result) : getArgumentType(result);
                if (!checkCompatible(type, node.type)) {
                    logger.warn({breakingPath: node.ap, incompatibleReturnTypes: {actual: type, required: node.type}})
                }
                node.obj = result;
                node.processed = true;
            } catch (e) {
                logger.info('Error in executing the path: ' + JSON.stringify(node.ap));
                node.processed = true;
            }
            
        }
    }

    while (true) {
        let next = findNextNode(node);
        if (!next) {
            return;
        }
        traverseTree(next, rhoRelations);
    }
}

let model = JSON.parse(fs.readFileSync(modelPath, {encoding: 'utf-8'}));

let [modelTree, rhoRelations] = constructModelTree(model);

traverseTree(modelTree, rhoRelations);