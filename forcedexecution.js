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


let modelPath = argv.model;


/* hint class
    * This class is used to store hints about the model.
    */

class Hints {
    modules = [];
    moduleIndex = new Map();
    functions = new Set();
    reads = new Map();
    writes = new Map();
    requires = new Map();
    evals = new Map();
    addModule(m) {
        return (0, util_1.getOrSet)(this.moduleIndex, m, () => {
            this.modules.push(m);
            return this.modules.length - 1;
        });
    }
    addFunction(f) {
        this.functions.add(f);
    }
    addReadHint(h) {
        if (patching.APPROX_READ)
            (0, util_1.mapArrayAddNoDuplicates)(h.loc, h, this.reads, (v1, v2) => v1.prop === v2.prop && v1.valLoc === v2.valLoc && v1.valType === v2.valType);
    }
    addWriteHint(h) {
        if (patching.APPROX_WRITE)
            (0, util_1.mapArrayAddNoDuplicates)(h.loc, h, this.writes, (v1, v2) => v1.type === v2.type && v1.baseLoc === v2.baseLoc && v1.baseType === v2.baseType &&
                v1.prop === v2.prop && v1.valLoc === v2.valLoc && v1.valType === v2.valType);
    }
    addRequireHint(h) {
        (0, util_1.mapArrayAddNoDuplicates)(h.loc, h, this.requires, (v1, v2) => v1.str === v2.str);
    }
    addEvalHint(h) {
        (0, util_1.mapArrayAddNoDuplicates)(h.loc, h, this.evals, (v1, v2) => v1.str === v2.str);
    }
    add(newHints) {
        const moduleReindex = new Map();
        for (const [i, s] of newHints.modules.entries())
            moduleReindex.set(i, this.addModule(s));
        const convert = (loc) => `${moduleReindex.get(parseInt(loc))}${loc.substring(loc.indexOf(":"))}`;
        for (const f of newHints.functions)
            this.addFunction(convert(f));
        for (const { loc, prop, valLoc, valType } of newHints.reads) {
            this.addReadHint({
                loc: convert(loc),
                prop,
                valLoc: convert(valLoc),
                valType
            });
        }
        for (const { type, loc, baseLoc, baseType, prop, valLoc, valType } of newHints.writes) {
            this.addWriteHint({
                type,
                loc: convert(loc),
                baseLoc: convert(baseLoc),
                baseType,
                prop,
                valLoc: convert(valLoc),
                valType
            });
        }
        for (const { loc, str } of newHints.requires)
            this.addRequireHint({
                loc: convert(loc),
                str
            });
        for (const { loc, str } of newHints.evals)
            this.addEvalHint({
                loc: convert(loc),
                str
            });
    }
    toJSON() {
        return {
            modules: this.modules,
            functions: Array.from(this.functions),
            reads: Array.from(this.reads.values()).flat(),
            writes: Array.from(this.writes.values()).flat(),
            requires: Array.from(this.requires.values()).flat(),
            evals: Array.from(this.evals.values()).flat()
        };
    }
    saveToFile(file) {
        const fd = (0, fs.openSync)(file, "w");
        (0, files_1.writeStreamedStringify)(this.toJSON(), fd);
        (0, fs.closeSync)(fd);
        logger.default.info(`Approximate interpretation hints written to ${file}`);
    }
    clearHints() {
        this.reads.clear();
        this.writes.clear();
        this.requires.clear();
        this.evals.clear();
    }
}

class ProcessManager {
    a;
    p;
    hints = new Hints();
    numExecutions = 0;
    numForced = 0;
    numForcedExceptions = 0;
    numModuleExceptions = 0;
    numStaticFunctions = 0;
    staticRequires = new Map();
    approxTime = 0n;
    totalCodeSize = 0;
    resultPromiseResolve;
    timer;
    constructor(a = new globalstate_1.GlobalState) {
        this.a = a;
        logger.default.verbose("Starting approximate interpretation process");
        const resolvedDirname = __dirname.endsWith(".js") ? __dirname : `${__dirname}/../../lib/approx`;
        this.p = (0, child_process_1.fork)(`${resolvedDirname}/approx.js`, [JSON.stringify(options_1.options)], { stdio: "inherit" });
        this.p.on('message', (msg) => {
            if (!this.resultPromiseResolve) {
                logger.default.error("Unexpected message from child process");
                return;
            }
            if (logger.default.isDebugEnabled())
                logger.default.debug(`Hints received from approximate interpretation process:\n${JSON.stringify(msg, undefined, 2)}`);
            this.add(msg.hints);
            this.numForced += msg.numForced;
            this.numForcedExceptions += msg.numForcedExceptions;
            this.numModuleExceptions += msg.moduleException ? 1 : 0;
            this.numStaticFunctions += msg.numStaticFunctions;
            (0, util_1.addPairArrayToMapSet)(msg.staticRequires, this.staticRequires);
            this.totalCodeSize = msg.totalCodeSize;
            this.resultPromiseResolve();
            this.resultPromiseResolve = undefined;
            this.approxTime += this.timer.elapsed();
            this.timer = undefined;
        });
    }
    async analyzeFiles(files) {
        for (const file of files)
            this.a.reachedFile((0, path_1.resolve)(options_1.options.basedir, file), true);
        while (this.a.pendingFiles.length > 0) {
            const file = this.a.pendingFiles.shift();
            const m = this.a.getModuleInfo(file);
            if (this.hints.moduleIndex.has(m.toString())) {
                if (logger.default.isDebugEnabled())
                    logger.default.debug(`Skipping ${m}, module already visited`);
            }
            else if (!([".js", ".jsx", ".es", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts"].includes((0, path_1.extname)(file)) ||
                ((0, path_1.extname)(file) === "" && (0, files_1.isShebang)(file))))
                logger.default.info(`Skipping ${m}, unsupported extension`);
            else {
                if (options_1.options.printProgress)
                    logger.default.info(`Analyzing ${m}`);
                await this.execute(file);
            }
            const rs = this.staticRequires.get(file);
            if (rs)
                for (const r of rs)
                    try {
                        const filepath = (0, files_1.requireResolve)(r, file, this.a);
                        if (filepath)
                            this.a.reachedFile(filepath, false, m, (0, files_1.isLocalRequire)(r));
                    }
                    catch {
                        logger.default.warn(`Unable to resolve module '${r}' from ${file}`);
                    }
        }
    }
    stop() {
        logger.default.verbose("Stopping approximate interpretation process");
        this.p.kill();
    }

    async execute(file) {
        (0, transform_1.checkFile)(file);
        this.timer = new timer_1.default();
        this.numExecutions++;
        return new Promise((resolve) => {
            this.resultPromiseResolve = resolve;
            this.p.send({ file });
        });
    }

    add(newHints) {
        for (const [i, s] of newHints.modules.entries())
            if (s[0] === "/") {
                const j = s.indexOf(":eval["), file = j === -1 ? s : s.substring(0, j), rest = j === -1 ? "" : s.substring(j);
                const mod = this.a.reachedFile(file, false);
                newHints.modules[i] = mod.toString() + rest;
            }
        this.hints.add(newHints);
    }

    printDiagnostics() {
        const staticFunctionsVisited = this.getStaticFunctionsVisited();
        logger.default.info(`Approximate interpretation time: ${(0, timer_1.nanoToMs)(this.approxTime)}, packages visited: ${this.a.packageInfos.size}, code size: ${Math.ceil(this.totalCodeSize / 1024)}KB`);
        logger.default.info(`Modules analyzed dynamically: ${this.numExecutions}, visited: ${this.a.moduleInfos.size}, exceptions: ${this.numModuleExceptions}`);
        logger.default.info(`Force-executed functions: ${this.numForced}/${this.numStaticFunctions}, ` +
            `visited: ${staticFunctionsVisited}${this.numStaticFunctions > 0 ? ` (${(0, util_1.percent)(staticFunctionsVisited / this.numStaticFunctions)})` : ""}, ` +
            `exceptions: ${this.numForcedExceptions}`);
        logger.default.info(`Produced hints reads: ${(0, util_1.mapArraySize)(this.hints.reads)}, writes: ${(0, util_1.mapArraySize)(this.hints.writes)}, ` +
            `requires: ${(0, util_1.mapArraySize)(this.hints.requires)}, evals: ${(0, util_1.mapArraySize)(this.hints.evals)}`);
    }

    getDiagnostics() {
        return {
            time: this.approxTime,
            visitedPackages: this.a.packageInfos.size,
            codeSize: Math.ceil(this.totalCodeSize / 1024),
            modulesAnalyzed: this.numExecutions,
            modulesVisited: this.a.moduleInfos.size,
            moduleExceptions: this.numModuleExceptions,
            forceExecutedFunctions: this.numForced,
            staticFunctions: this.numStaticFunctions,
            staticFunctionsVisited: this.getStaticFunctionsVisited(),
            exceptions: this.numModuleExceptions
        };
    }
    getStaticFunctionsVisited() {
        let c = 0;
        for (const f of this.hints.functions) {
            const i = parseInt(f);
            if (!this.hints.modules[i].endsWith("]"))
                c++;
        }
        return c;
    }
    saveDiagnosticsToFile(file) {
        const fd = (0, fs.openSync)(file, "w");
        (0, fs.writeSync)(fd, (0, util_1.stringify)(this.getDiagnostics()));
        (0, fs.closeSync)(fd);
        logger.default.info(`Approximate interpretation diagnostics written to ${file}`);
    }
}

class TaintSpec {

}

/**
 * Taint analysis from the collected information.
 */
function taintAnalysis(modelContent) {
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

function forcefullyExecute(node, rhoRelations) {
    logger.info('Processing node path: ' + JSON.stringify(node.ap));

    if (node.parent === null || node.parent === undefined) {
        for (let c of node.children) {
            forcefullyExecute(c, rhoRelations);
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
                        forcefullyExecute(rhoRelations[i][0], rhoRelations);
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
                        forcefullyExecute(x, rhoRelations);
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
                        forcefullyExecute(x, rhoRelations);
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
        forcefullyExecute(next, rhoRelations);
    }
}

let model = JSON.parse(fs.readFileSync(modelPath, {encoding: 'utf-8'}));

let [modelTree, rhoRelations] = taintAnalysis(model);

forcefullyExecute(modelTree, rhoRelations);