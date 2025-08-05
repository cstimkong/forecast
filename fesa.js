'use strict'

/**
 * This file is part of FesaJS framework.
 * 
 */

const deepEqual = require('deep-equal');
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const fs = require('node:fs');
const {getType, getArgumentType, isCovariant, makeRandomString} = require('./lib/utils');
const process = require('process');
const path = require('node:path');
const objectHash = require('object-hash');
const pretty = require('pino-pretty');
const pino = require('pino').default;
const assert = require('assert');
const logger = pino(pretty({sync: true}));

let argv = yargs(hideBin(process.argv))
  .usage('Run FesaJS for a JavaScript library').option('library', {
    alias: 'l',
    type: 'string',
    description: 'Library name (used in require call)'
  })
  .option('client', {
    alias: 'm',
    type: 'string',
    description: 'A node.js module'
  })
  .option('mocha', {
    type: 'boolean',
    description: 'Client JavaScript file or project use mocha as the test framework'
  })
  .option('all', {
    alias: 'a',
    type: 'boolean',
    description: 'Try to detect all paths'
  })
  .option('timeout', {
    type: 'string',
    description: 'Timeout of the Fesa execution'
  })
  .option('detection-only', {
    type: 'string',
    description: 'Only detect the vulnerability, without exploitation'
  })
  .option('max-execution-time', {
    type: 'string',
    description: 'max forced execution time'
  })
  .demandOption(['library', 'client'])
  .help().parse();

(function() {
    let client = argv.client;

    let pathTree = {p: null, callChildren: {},
        newChildren: {},
        argChildren: {},
        accessPropChildren: {},
        writePropChildren: {},
        requireChildren: {},
        type: null
    };
    
    let order = 0;
    let rhoRelations = [];

    let nativeModules = ['fs', 'net', 'os', 'http', 'https', 'crypto', 'buffer', 
        'dns', 'events', 'assert', 'console', 'process', 'child_process', 'util'
    ];


    function addPathAndType(path, type) {
        let t = pathTree;
        for (let pathComp of path) {
            if (pathComp.compType === 'require') {
                if (!t.requireChildren[pathComp.moduleName]) {
                    t.requireChildren[pathComp.moduleName] = {p: pathComp, callChildren: {}, newChildren: {}, argChildren: {}, accessPropChildren: {}, writePropChildren: {}, type: type, order: order++};
                }
                t = t.requireChildren[pathComp.moduleName];
            }

            if (pathComp.compType === 'accessProp') {
                if (!t.accessPropChildren[pathComp.propName]) {
                    t.accessPropChildren[pathComp.propName] = {p: pathComp, callChildren: {}, newChildren: {}, argChildren: {}, accessPropChildren: {}, writePropChildren: {}, type: type, order: order++};
                }
                t = t.accessPropChildren[pathComp.propName];
            }
            
            if (pathComp.compType === 'writeProp') {
                if (!t.writePropChildren[pathComp.propName]) {
                    t.writePropChildren[pathComp.propName] = {p: pathComp, callChildren: {}, newChildren: {}, argChildren: {}, accessPropChildren: {}, writePropChildren: {}, type: type, order: order++};
                }
                t = t.writePropChildren[pathComp.propName];
            }
            
            if (pathComp.compType === 'arg') {
                if (!t.argChildren[pathComp.callId]) {
                    t.argChildren[pathComp.callId] = {};
                }
                if (!t.argChildren[pathComp.callId][pathComp.argId]) {
                    t.argChildren[pathComp.callId][pathComp.argId] = {p: pathComp, callChildren: {}, newChildren: {}, argChildren: {}, accessPropChildren: {}, writePropChildren: {}, type: type, order: order++};
                }
                t = t.argChildren[pathComp.callId][pathComp.argId];
            }

            if (pathComp.compType === 'call') {
                if (!t.callChildren[pathComp.callId]) {
                    t.callChildren[pathComp.callId] = {p: pathComp, callChildren: {}, newChildren: {}, argChildren: {}, accessPropChildren: {}, writePropChildren: {}, type: type, order: order++};
                }
                t = t.callChildren[pathComp.callId];
            }

            if (pathComp.compType === 'new') {
                if (!t.newChildren[pathComp.callId]) {
                    t.newChildren[pathComp.callId] = {p: pathComp, callChildren: {}, newChildren: {}, argChildren: {}, accessPropChildren: {}, writePropChildren: {}, type: type, order: order++};
                }
                t = t.newChildren[pathComp.callId];
            }
        }
        logger.info(`Added path: ${JSON.stringify(path)}, type: ${JSON.stringify(type)}`);
    }

    function removePathsWithPrefix(prefix) {
        assert(prefix[prefix.length - 1].compType === 'call');

        let t = pathTree;
        for (let pathComp of prefix.slice(0, prefix.length - 1)) {
            if (pathComp.compType === 'require') {
                t = t.requireChildren[pathComp.moduleName];
            }
            else if (pathComp.compType === 'accessProp') {
                t = t.accessPropChildren[pathComp.propName];
            }
            else if (pathComp.compType === 'writeProp') {
                t = t.writePropChildren[pathComp.propName];
            }
            else if (pathComp.compType === 'arg') {
                t = t.argChildren[pathComp.callId][pathComp.argId];
            }
            else if (pathComp.compType === 'call') {
                t = t.callChildren[pathComp.callId];
            }
            else if (pathComp.compType === 'new') {
                t = t.newChildren[pathComp.callId];
            }
        }

        
        delete t.callChildren[prefix[prefix.length - 1].callId];
    }


    function pathTreeToList(currentNode, accumulatedPath, allPaths) {
        if (currentNode.p !== null) {
            allPaths.push({path: accumulatedPath.concat(currentNode.p), type: currentNode.type, order: currentNode.order})
        }
        let ap = accumulatedPath.concat(currentNode.p === null ? [] : currentNode.p);
        if (currentNode.requireChildren) {
            for (let c of Object.values(currentNode.requireChildren)) {
                pathTreeToList(c, ap, allPaths);
            }
        }

        for (let c of Object.values(currentNode.callChildren)) {
            pathTreeToList(c, ap, allPaths);
        }
        for (let c of Object.values(currentNode.argChildren)) {
            for (let argChild of Object.values(c)) {
                pathTreeToList(argChild, ap, allPaths);
            }
        }
        for (let c of Object.values(currentNode.newChildren)) {
            pathTreeToList(c, ap, allPaths);
        }
        for (let c of Object.values(currentNode.accessPropChildren)) {
            pathTreeToList(c, ap, allPaths);
        }
        for (let c of Object.values(currentNode.writePropChildren)) {
            pathTreeToList(c, ap, allPaths);
        }
        
    }

    function getProxy(obj, path) {
        let proxy = new Proxy(obj, {
            get: function(target, p, receiver) {
                // If the property is a Symbol, the corresponding value is directly returned since
                // the original NoRegrets+ does not deal with Symbols.
                if (typeof p !== 'string') {
                    return target[p];
                }
                // Return the access path for an object.
                if (p === '@@__PATH__@@') {
                    return path;
                }

                if (typeof target[p] === 'function' && target[p].toString().indexOf('[native code]') >= 0) {
                    return target[p];
                }
                let newPath = path.concat([{compType: 'accessProp', propName: p}]);
                let type = isCovariant(newPath)? getType(target[p]) : getArgumentType(target[p]);
                addPathAndType(newPath, type);
                if (target[p] !== null && (type === 'object' || type === 'function')) {
                    return getProxy(target[p], newPath);
                } else {
                    return target[p];
                }
            },
            set: function(target, p, newValue) {
                let newPath = path.concat([{compType: 'writeProp', propName: p}]);
                let type = isCovariant(newPath) ? getType(newValue) : getArgumentType(newValue);
                addPathAndType(newPath, type);
                target[p] = newValue;
                return true;
            },
            apply: function(target, thisArg, argArray) {
                let callId = makeRandomString(6);
                let proxiedArgArray = [];
                for (let i = 0; i < argArray.length; i++) {
                    let newPath = path.concat([{compType: 'arg', callId: callId, argId: i}]);
                    let type = isCovariant(newPath) ? getType(argArray[i]) : getArgumentType(argArray[i]);
                    addPathAndType(newPath, type);
                    if ((typeof argArray[i] === 'object' || typeof argArray[i] === 'function') && argArray[i] !== null) {
                        proxiedArgArray.push(getProxy(argArray[i], newPath));

                        let argPath = argArray[i]['@@__PATH__@@'];
                        if (argPath) {
                            rhoRelations.push([argPath, newPath]);
                        }
                    } else {
                        proxiedArgArray.push(argArray[i]);
                    }
                }

                let result = target.apply(thisArg, proxiedArgArray);
                
                let newPath = path.concat([{compType: 'call', callId: callId}]);
                let type = isCovariant(newPath) ? getType(result) : getArgumentType(result);
                addPathAndType(newPath, type);
                if (result !== null && typeof result === 'object' && result['@@__PATH__@@']) {
                    return result;
                }
                if (type === 'object' || type === 'function') {
                    return getProxy(result, newPath);
                } else {
                    return result
                }
            },
            construct: function(target, argArray, newTarget) {
                let callId = makeRandomString(6);
                let proxiedArgArray = [];
                for (let i = 0; i < argArray.length; i++) {
                    let newPath = path.concat([{compType: 'arg', callId: callId, argId: i}]);
                    let type = isCovariant(newPath) ? getType(argArray[i]) : getArgumentType(argArray[i]);
                    addPathAndType(newPath, type);
                    if (typeof argArray[i] === 'object' && argArray[i] !== null) {
                        proxiedArgArray.push(getProxy(argArray[i], newPath));
                        
                        let argPath = argArray[i]['@@__PATH__@@'];
                        if (argPath) {
                            rhoRelations.push([argPath, newPath]);
                        }
                    } else {
                        proxiedArgArray.push(argArray[i]);
                    }
                    
                }
                let result = Reflect.construct(target, argArray);
                let newPath = path.concat([{compType: 'new', callId: callId}]);
                let type = isCovariant(newPath) ? getType(result) : getArgumentType(result);
                addPathAndType(newPath, type);
                return getProxy(result, newPath);
            }
            
        });
        return proxy;
    }

    function getPrefixPairs() {
        let results = [];
        for (let i = 0; i < allPaths.length; i++) {
            if (isCovariant(allPaths[i].path)) {
                let x = [];
                let l = allPaths[i].path.length - 1;
                for (let j = 0; j < allPaths.length; j++) {
                    if (deepEqual(allPaths[j].path.slice(0, allPaths[j].path.length - 1), allPaths[i].path)
                        && allPaths[j].path[allPaths[j].path.length - 1].compType === 'call') {
                        x.push(allPaths[j].path);
                    }
                }
                if (x.length > 1) {
                    results.push(x);
                }
            }
        }
        return results;
    }



    function pathInRhoRelations(path) {
        for (let r of rhoRelations) {
            if (deepEqual(r[0], path) || deepEqual(r[1], path)) {
                return true;
            }
        }
        return false;
    }


    function compress() {
        let iteration = 0;
        while (true) {
            logger.info(`Remove paths iteration ${iteration}`);
            let pathCount = allPaths.length;
            tryRemovePath();
            if (allPaths.length === pathCount) {
                break;
            }
            iteration += 1;
        }
    }

    /**
     * 
     * Simulate the behavior of require function to find the module path according to module name and client path.
     */
    function findModule(moduleName, clientPath) {
        let p = path.resolve(path.dirname(clientPath));
        if (moduleName.startsWith('.')) {
            if (moduleName.endsWith('.js') || moduleName.endsWith('.cjs')) {
                let filePath = path.join(p, 'node_modules', moduleName);
                if (fs.existsSync(filePath)) {
                    return filePath;
                } else {
                    return undefined;
                }
            }
            else {
                let filePath = path.join(p, 'node_modules', moduleName + '.js');
                if (fs.existsSync(filePath)) {
                    return filePath;
                }
                filePath = path.join(p, 'node_modules', moduleName + '.cjs');
                if (fs.existsSync(filePath)) {
                    return filePath;
                }
                return undefined;
            }
        }

        while (true) {
            if (fs.existsSync(path.join(p, 'node_modules', moduleName, 'package.json'))) {
                let packageJsonContent = require(path.join(p, 'node_modules', moduleName, 'package.json'));
                let entryFile = packageJsonContent.main;
                if (!entryFile) {
                    entryFile = 'index.js';
                }
                if (fs.existsSync(path.join(p, 'node_modules', moduleName, entryFile))) {
                    return path.join(p, 'node_modules', moduleName, entryFile);
                } else {
                    return undefined;
                }
            }
            if (path.resolve(p, '..') === p) {
                break;
            }
            p = path.resolve(p, '..');
        }
        return undefined;
    }

    function mockedRequire(moduleName) {
        // For native modules, directly import them
        if (moduleName.startsWith('node:')) {
            return require(moduleName);
        }
        if (nativeModules.indexOf(moduleName) >= 0) {
            return require(moduleName);
        }
        let modulePath = findModule(moduleName, argv.client);
        if (!modulePath) {
            throw new Error(`Cannot find the module "${moduleName}"`);
        }

        if (moduleName === argv.library) {
            let lib = require(modulePath);
            let initPath = [{compType: 'require', moduleName: moduleName}]
            let proxiedLib = getProxy(lib, initPath)
            let type = getType(lib);
            addPathAndType(initPath, type);
            return proxiedLib;
        } else {
            return require(modulePath);
        }
    }

    function getJavaScriptFilesInDirectory(dir) {
        let files = [];
        const getFilesRecursively = (directory) => {
            const filesInDirectory = fs.readdirSync(directory);
            for (const file of filesInDirectory) {
                const absolute = path.join(directory, file);
                if (fs.statSync(absolute).isDirectory()) {
                    getFilesRecursively(absolute);
                } else if (file.endsWith('.js') || file.endsWith('.cjs')) {
                    files.push(absolute);
                }
            }
        };
        getFilesRecursively(path.resolve(dir));
        return files;
    }

    let javaScriptFiles;
    if (fs.statSync(argv.client).isDirectory()) {
        javaScriptFiles = getJavaScriptFilesInDirectory(client);
    } else {
        javaScriptFiles = [path.resolve(client)];
    }


    if (!argv.mocha) {
        javaScriptFiles.forEach(f => {
            let content = fs.readFileSync(f, {encoding: 'utf-8'});
            try {
                new Function('require', content)(mockedRequire);
            } catch (e) {
                logger.info(`Encountered error in executing ${f}: ` + e);
            }
        });
        
    } else {
        javaScriptFiles.forEach(f => {
            let content = fs.readFileSync(f, {encoding: 'utf-8'});
            try {
                new Function('require', 'describe', 'it', 'expect', 'assert', content)(
                    mockedRequire,
                    function(message, cb) {
                        logger.info(`Executing: ${message}`);
                        cb();
                    },
                    function(message, cb) {
                        logger.info(`Executing test: ${message}`);
                        if (cb.length === 1) {
                            cb(function() {});
                        } else {
                            cb();
                        }
                    },
                    require('expect.js'),
                    require('assert')
                );
            } catch (e) {
                logger.info(`Encountered error in executing ${f}: ` + e);
            }
        });
    }

    if (argv.compress) {
        compress();
    }   

    logger.info('Rho relations: ' + JSON.stringify(rhoRelations));


    let outputPath = argv.output;
    if (outputPath) {
        let allPaths = [];
        pathTreeToList(pathTree, [], allPaths);
        allPaths.sort((a, b) => a.order - b.order);
        fs.writeFileSync(outputPath, JSON.stringify({paths: allPaths, rhoRelations: rhoRelations}, (k, v) => {
            if (v === Infinity) {
                return 'Infinity';
            }
            if (Number.isNaN(v)) {
                return 'NaN';
            }
            return v;
        }));
        logger.info(`Written to the file ${argv.output}`)
    }
})()