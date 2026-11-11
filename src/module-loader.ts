/**
 * 
 * This file is part of Forecast.
 */

import vm from 'vm';
import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';
import Module from 'module';
import { pathToFileURL, URL } from 'url';
import { parse } from '@babel/parser';
import traverse, {Node, NodePath} from '@babel/traverse';
import babelGenerator from '@babel/generator';
import { identifier, blockStatement, functionExpression, parenthesizedExpression, expressionStatement } from '@babel/types';

/* require is only to load internal modules */
const _require = Module.createRequire('file://' + path.resolve(process.cwd()) + '/');
const internalModules: readonly string[] = Module.builtinModules;

/**
 * Whether a path refers to a Node.js module
 * @param modulePath the path to a Node.js module
 */
function isNodeJSModule(modulePath: string): boolean {
    let p = path.resolve(modulePath);
    if (existsSync(path.join(p, 'package.json'))) {
        return true;
    }
    return false;
}

/**
 * Transform `import.meta` structure in the source code into `__importmeta`
 * 
 */
function transformImportMeta(ast: Node) {
    traverse.default(ast, {
        MetaProperty: {
            exit(path: NodePath) {
                path.replaceWith(identifier('__importmeta'));
                path.skip();
            }
        },
        Import: {
            exit(path: NodePath) {
                path.replaceWith(identifier('__import'));
                path.skip();
            }
        }
    });
    return ast;
}

/**
 * 
 * @param subPathSpec `exports` spec of the subpath
 * @param modulePath path of the Node.js module (containing a package.json file)
 * @returns null or the real subpath
 */
function getRealSubPath(subPathSpec: NodeJS.Dict<any> | string, modulePath: string) {
    let realSubPath = null;
    if (Array.isArray(subPathSpec)) {
        for (let spec of subPathSpec) {
            if (typeof spec === 'object') {
                if (spec.require) {
                    if (typeof spec.require === 'string') {
                        realSubPath = spec.require;
                    }
                    else if (typeof spec.require === 'object' && typeof spec.require.default === 'string') {
                        realSubPath = spec.require.default;
                    }
                }
                else if (spec.default) {
                    if (typeof spec.default === 'string') {
                        realSubPath = spec.default;
                    }
                }
                else if (spec.import) {
                    if (typeof spec.import === 'string') {
                        realSubPath = spec.import;
                    }
                    else if (typeof spec.import === 'object' && typeof spec.import.default === 'string') {
                        realSubPath = spec.import.default;
                    }
                }
                if (existsSync(path.join(modulePath, realSubPath.replace('/', path.sep)))) {
                    break;
                }
            }
            else if (typeof spec === 'string') {
                realSubPath = spec;
                if (existsSync(path.join(modulePath, realSubPath.replace('/', path.sep)))) {
                    break;
                }
            }
        }
    }

    else if (typeof subPathSpec === 'string') {
        return subPathSpec;
    }

    else if (typeof subPathSpec === 'object') {
        if (typeof subPathSpec.require === 'string') {
            realSubPath = subPathSpec.require;
        }
        if (typeof subPathSpec.require === 'object' && subPathSpec.require.default) {
            realSubPath = subPathSpec.require.default;
        }
        else if (typeof subPathSpec.default === 'string') {
            realSubPath = subPathSpec.default;
        }
        else if (typeof subPathSpec.import === 'string') {
            realSubPath = subPathSpec.import;
        }
        if (typeof subPathSpec.import === 'object' && subPathSpec.import.default) {
            realSubPath = subPathSpec.import.default;
        }
    }
    console.log(realSubPath)
    return realSubPath;
}

export type LoadOptions = {
    instrumentFunc?: (sourceCode: string, filename: string) => string,
    globalThis?: object,
    subPath?: string,
    returnSourceFiles?: boolean
}

/**
 * Load a Node.js library.
 * 
 * @param modulePath Absolute or relative path to a JavaScript module 
 * (a directory or a JavaScript source file), which is regarded as relative
 * or absolute path in the filesystem.
 * @param options Additional options
 */

export function loadModuleSync(modulePath: string, options?: LoadOptions): any {
    if (!options) {
        options = {};
    }

    let moduleCache: any = {};
    let sourceFiles = new Set();
    let loadingModules: any = {};

    let context = typeof options.globalThis === 'object' ? options.globalThis : {};
    if (context !== globalThis) {
        (context as any).global = context;
    }
    /**
     * @private
     * Mocked `Module` class, subject to a loading process.
     */
    let MockedModule = class Module {
        id?: string | undefined;
        filename?: string | undefined;
        exports?: any;
        constructor(id?: string, filename?: string) {
            this.exports = {};
            this.id = id;
            this.filename = filename;
        }

        static createRequire(filename: string | URL) {
            return mockedRequire.bind(undefined, path.dirname(filename instanceof URL ? filename.toString() : filename), loadingModules, false) as Function;
        }
    }

    /**
     * 
     * @private
     * Synchronously load a module (a single JavaScript source file or a directory containt package.json),
     * `loadingModule` is used to resolve circular references 
     */
    function _loadNodeJSFile(modulePath: string, loadingModules: any) {
        if (modulePath.endsWith('.json')) {
            if (!existsSync(modulePath)) {
                throw new Error(`Module not found: ${modulePath}`);
            }
        
            try {
                let jsonContent = readFileSync(modulePath, { encoding: 'utf-8' });
                return JSON.parse(jsonContent);
            } catch (e) {
                throw new Error(`Error in loading module ${modulePath}`);
            }
        }

        if ((modulePath.endsWith('.js') || modulePath.endsWith('.cjs') || modulePath.endsWith('.mjs')) && existsSync(modulePath) && statSync(modulePath).isFile()) {

            if (loadingModules && loadingModules[path.resolve(modulePath)]) {
                return loadingModules[path.resolve(modulePath)].exports;
            }
            if (moduleCache[path.resolve(modulePath)]) {
                return moduleCache[path.resolve(modulePath)];
            }
            try {
                let rawCode = readFileSync(modulePath, { encoding: 'utf-8' });

                let instrumentedCode;
                if (options && options.instrumentFunc !== undefined) {
                    instrumentedCode = options.instrumentFunc(rawCode, path.resolve(modulePath));
                } else {
                    instrumentedCode = rawCode;
                }

                let ast = parse(instrumentedCode, { sourceFilename: path.resolve(modulePath) });

                traverse.default(ast, {
                    Program: {
                        exit(path) {
                            let funcExpr = functionExpression(
                                null,
                                [
                                    identifier('module'),
                                    identifier('exports'),
                                    identifier('require'),
                                    identifier('__filename'),
                                    identifier('__dirname')
                                ],
                                blockStatement(
                                    path.node.body,
                                    path.node.directives
                                )
                            );

                            path.node.body = [expressionStatement(parenthesizedExpression(funcExpr))];
                            path.node.directives = [];
                            path.skip();
                        }
                    }
                });

                instrumentedCode = babelGenerator.default(ast).code;

                let compiledFunction = vm.runInNewContext(instrumentedCode,
                    context,
                    { filename: path.resolve(modulePath) }
                );

                let m = new MockedModule();
                if (loadingModules) {
                    loadingModules[path.resolve(modulePath)] = m;
                }

                compiledFunction.call(
                    m.exports,
                    m,
                    m.exports,
                    Object.defineProperty(
                        mockedRequire.bind(undefined, path.resolve(modulePath), loadingModules, false),
                        'resolve',
                        {
                            enumerable: false,
                            configurable: false,
                            value: mockedRequire.bind(undefined, path.resolve(modulePath), loadingModules, true)
                        }
                    ),
                    path.resolve(modulePath),
                    path.dirname(path.resolve(modulePath))
                );

                sourceFiles.add(path.resolve(modulePath));
                moduleCache[path.resolve(modulePath)] = m.exports;
                if (loadingModules) {
                    delete loadingModules[path.resolve(modulePath)];
                }
                return m.exports;

            } catch (e: any) {
                throw new Error(`Error occurs in loading module ${modulePath}: ${e.message}`);
            }
        }
        else {
            throw new Error(`Cannot find module: ${modulePath}`);
        }
    }


    function mockedRequire(currentModulePath: string, loadingModules: any, resolveOnly: boolean, moduleName: string) {
        /* If the loaded module require a module named 'module', require the mocked Module directly */
        if (moduleName === 'node:module' || moduleName === 'module') {
            if (resolveOnly)
                return moduleName;
            return MockedModule;
        }

        /* Directly load the internal modules */
        if (internalModules.indexOf(moduleName) >= 0) {
            if (resolveOnly)
                return moduleName;
            return _require(moduleName);
        }

        if (moduleName.startsWith('node:')) {
            if (resolveOnly)
                return moduleName;
            return _require(moduleName);
        }

        let moduleFile = _require.resolve(moduleName, {paths: [path.dirname(currentModulePath)]});
        
        if (resolveOnly)
            return moduleFile;

        return _loadNodeJSFile(moduleFile, loadingModules);

    }
    
    modulePath = _require.resolve(modulePath);
    if (options && options.returnSourceFiles) {
        return [_loadNodeJSFile(modulePath, loadingModules), Array.from(sourceFiles)];
    } else {
        return _loadNodeJSFile(modulePath, loadingModules);
    }

}