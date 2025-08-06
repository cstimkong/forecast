'use strict';

const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const codeInstrumentation = require('./code-instrumentation');

const internalModules = ['fs', 'path', 'vm', 'process', 'child_process', 'net', 'http', 'https', 'events', 'crypto', 'os', 'util'];

function MockedModule(id, filename) {
    this.exports = {};
    this.id = id;
    this.filename = filename;
}


/**
 * `require` mock for the instrumented code.
 * 
 * @param {String} modulePath Module path, which is regarded as relative or absolute path in the filesystem. The top-level
 * `require` does not load modules from `node_modules` directory.
 */

function loadNodeJSModule(modulePath) {
    let moduleCache = {};

    function _loadNodeJSModule(modulePath, instrumented) {

        if (modulePath.endsWith('.js') || modulePath.endsWith('.cjs')) {
            if (moduleCache[path.resolve(modulePath)]) {
                return moduleCache[path.resolve(modulePath)];
            }
            try {
                let rawCode = fs.readFileSync(modulePath, { encoding: 'utf-8' });
                let instrumentedCode;
                if (instrumented || (instrumented === undefined)) {
                    instrumentedCode = codeInstrumentation(rawCode, path.resolve(modulePath));
                } else {
                    instrumentedCode = rawCode;
                }
                let compiledFunction = vm.runInThisContext(instrumentedCode, {
                    filename: path.resolve(modulePath)
                });

                let m = new MockedModule();
                compiledFunction.call(
                    m.exports, 
                    m,
                    m.exports,
                    mockedRequire.bind(undefined, path.resolve(modulePath)),
                    path.resolve(modulePath), path.dirname(path.resolve(modulePath)),
                    function (start, end, filename, type) {
                        if (typeof globalThis.__record__ === 'function') {
                            // __record__ on globalThis should be modified before a forced execution
                            globalThis.__record__({ startByte: start, endByte: end, filename: filename, type: type });
                        } else {
                            // a fallback __record__ implementation, should not be use
                            console.log(`Start byte: ${start}, end byte: ${end}, file: ${filename} type: ${type}`);
                        }
                    }
                )
                moduleCache[path.resolve(modulePath)] = m.exports;
                return m.exports;
                
            } catch (e) {
                throw e;
            }
        }
        else if (fs.existsSync(modulePath) && fs.statSync(modulePath).isDirectory()) {
            let packageJsonPath = path.resolve(path.join(modulePath, 'package.json'));
            if (!fs.existsSync(packageJsonPath) || !fs.statSync(packageJsonPath).isFile()) {
                throw new Error(`Not a Node.js module: ${modulePath}`);
            }
            let jsonContent = fs.readFileSync(packageJsonPath, {encoding: 'utf-8'});
            let packageJsonObject = JSON.parse(jsonContent);
            let entryFile = packageJsonObject.main;
            if (!entryFile) {
                entryFile = 'index.js';
            }
            if (!entryFile.endsWith('.js') && !entryFile.endsWith('.cjs')) {
                if (fs.existsSync(path.join(modulePath, entryFile + '.js'))) {
                    entryFile += '.js'
                }
                else if (fs.existsSync(path.join(modulePath, entryFile + '.cjs'))) {
                    entryFile += '.cjs'
                }
            }
            return _loadNodeJSModule(path.resolve(path.join(modulePath, entryFile)));
        }

    }

    function mockedRequire(currentModulePath, moduleName) {
        if (internalModules.indexOf(moduleName) >= 0) {
            return require(moduleName);
        }
        if (moduleName.startsWith('node:')) {
            return require(moduleName);
        }
        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
            if (moduleName.endsWith('.js') || moduleName.endsWith('.cjs')) {
                return _loadNodeJSModule(
                    path.join(path.dirname(currentModulePath), moduleName)
                );
            }

            let targetModulePath = path.join(path.dirname(currentModulePath), moduleName + '.js');

            if (fs.existsSync(targetModulePath)) {
                return _loadNodeJSModule(targetModulePath);
            }

            targetModulePath = path.join(path.dirname(currentModulePath), moduleName + '.cjs');

            if (fs.existsSync(targetModulePath)) {
                return _loadNodeJSModule(targetModulePath);
            }

            targetModulePath = path.join(path.dirname(currentModulePath), moduleName);
            if (fs.existsSync(targetModulePath)) {
                return _loadNodeJSModule(targetModulePath);
            }

            throw new Error('Cannot find module.');
        }
        else {
            let d = path.resolve(path.dirname(currentModulePath));
            while (!fs.existsSync(path.join(d, 'node_modules'))) {
                if (d === path.join(d, '..')) {
                    break;
                }
                d = path.join(d, '..');
            }

            let modulePath = path.join(d, 'node_modules', moduleName);
            return _loadNodeJSModule(modulePath);
        }

    }
    return _loadNodeJSModule(modulePath);
}



module.exports = loadNodeJSModule;

let res = loadNodeJSModule('./node_modules/minimatch');
console.log(res);