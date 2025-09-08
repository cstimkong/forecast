/**
 * 
 * This file is part of FesaJS
 */

import vm from 'vm';
import { existsSync, readFileSync, statSync } from 'fs';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import Module from 'module';
import { pathToFileURL, URL } from 'url';
import { parse } from '@babel/parser';
import traverse, {Node, NodePath} from '@babel/traverse';
import babelGenerator from '@babel/generator';
import { transformSync, transformAsync } from '@babel/core';
import { identifier, blockStatement, functionExpression, parenthesizedExpression, expressionStatement } from '@babel/types';

/* require is only to load internal modules */
const _require = Module.createRequire(import.meta.url);
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
    return realSubPath;
}

export type LoadOptions = {
    instrumentFunc?: (sourceCode: string, filename: string) => string,
    globalThis?: object,
    subPath?: string,
    returnSourceFiles?: boolean
}

function loadNodeJSModule(modulePath: string, async: false, options?: LoadOptions): any;
function loadNodeJSModule(modulePath: string, async: true, options?: LoadOptions): Promise<any>;

/**
 * Load a Node.js library.
 * 
 * @param modulePath Absolute or relative path to a JavaScript module 
 * (a directory or a JavaScript source file), which is regarded as relative
 * or absolute path in the filesystem.
 * @param options Additional options
 */

function loadNodeJSModule(modulePath: string, async: boolean, options?: LoadOptions): any {
    if (!options) {
        options = {};
    }

    let moduleCache: any = {};
    let sourceFiles = new Set();
    let loadingModules: any = {};

    let context = typeof options.globalThis === 'object' ? options.globalThis : {};
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
    function _loadNodeJSModule(modulePath: string, loadingModules: any, subPath?: string, resolveOnly?: boolean) {
        if (modulePath.endsWith('.json')) {
            if (!existsSync(modulePath)) {
                throw new Error(`Module not found: ${modulePath}`);
            }
        
            if (resolveOnly)
                return modulePath;

            try {
                let jsonContent = readFileSync(modulePath, { encoding: 'utf-8' });
                return JSON.parse(jsonContent);
            } catch (e) {
                throw new Error(`Error in loading module ${modulePath}`);
            }
        }

        if ((modulePath.endsWith('.js') || modulePath.endsWith('.cjs') || modulePath.endsWith('.mjs')) && existsSync(modulePath) && statSync(modulePath).isFile()) {
            if (resolveOnly)
                return modulePath;

            if (loadingModules && loadingModules[path.resolve(modulePath)]) {
                return loadingModules[path.resolve(modulePath)].exports;
            }
            if (moduleCache[path.resolve(modulePath)]) {
                return moduleCache[path.resolve(modulePath)];
            }
            try {
                let rawCode = readFileSync(modulePath, { encoding: 'utf-8' });
                if (modulePath.endsWith('.mjs') || modulePath.endsWith('.js')) {
                    rawCode = transformSync(rawCode, {
                        plugins: ['@babel/plugin-transform-modules-commonjs'] // might be replaced by a lightweight implementation later
                    })!.code!;
                }

                rawCode = babelGenerator.default(transformImportMeta(parse(rawCode, { sourceType: 'module' }))).code;

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
                                    identifier('__dirname'),
                                    identifier('__import'),
                                    identifier('__importmeta')
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
                    path.dirname(path.resolve(modulePath)),
                    mockedImport.bind(undefined, path.resolve(modulePath), loadingModules),
                    {
                        /* Mock import.meta structure */
                        dirname: path.dirname(path.resolve(modulePath)),
                        filename: path.resolve(modulePath),
                        url: pathToFileURL(path.resolve(modulePath)),
                        resolve: mockedRequire.bind(undefined, path.resolve(modulePath), loadingModules, true)
                    }
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
        else if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
            let packageJsonPath = path.resolve(path.join(modulePath, 'package.json'));
            let jsonContent = readFileSync(packageJsonPath, { encoding: 'utf-8' });
            let packageJsonObject = JSON.parse(jsonContent);
            if (!existsSync(packageJsonPath) || !statSync(packageJsonPath).isFile()) {
                throw new Error(`Not a moudle: ${modulePath}`);
            }

            if (!subPath || subPath === '.') {
                let entryFile = 'index.js';

                if (!packageJsonObject.exports || typeof packageJsonObject.exports === 'string') {
                    if (packageJsonObject.exports) {
                        entryFile = packageJsonObject.exports;
                    }
                    else if (packageJsonObject.main) {
                        entryFile = packageJsonObject.main;
                    }

                    if (!entryFile.endsWith('.js') && !entryFile.endsWith('.cjs') && !entryFile.endsWith('.mjs')) {
                        if (existsSync(path.join(modulePath, entryFile + '.js'))) {
                            entryFile += '.js'
                        }
                        else if (existsSync(path.join(modulePath, entryFile + '.cjs'))) {
                            entryFile += '.cjs'
                        }
                        else if (existsSync(path.join(modulePath, entryFile + '.mjs'))) {
                            entryFile += '.mjs'
                        }
                    }
                    return _loadNodeJSModule(
                        path.resolve(path.join(modulePath, entryFile)),
                        loadingModules
                    );
                } else {
                    let realEntryFile = getRealSubPath(packageJsonObject.exports, modulePath);
                    if (realEntryFile) {
                        entryFile = realEntryFile;
                    } else {
                        realEntryFile = getRealSubPath(packageJsonObject.exports['.'], modulePath);
                        if (!realEntryFile) {
                            throw new Error(`Cannot import the module ${modulePath} with subpath ${subPath}`);
                        }
                    }
                    entryFile = realEntryFile;
                    if (resolveOnly)
                        return path.resolve(path.join(modulePath, entryFile));
                    return _loadNodeJSModule(
                        path.resolve(path.join(modulePath, entryFile)),
                        loadingModules
                    );
                }
            }

            else {
                if (!packageJsonObject.exports) {
                    let moduleFilePath = path.resolve(path.join(modulePath, subPath.replace('/', path.sep)));
                    if (!moduleFilePath.endsWith('.js') && !moduleFilePath.endsWith('.cjs')) {
                        if (existsSync(path.join(moduleFilePath, 'index.js')) && statSync(path.join(moduleFilePath, 'index.js')).isFile()) {
                            moduleFilePath = path.join(moduleFilePath, 'index.js');
                        }
                        else if (existsSync(moduleFilePath + '.js')) {
                            moduleFilePath += '.js';
                        }
                        else if (existsSync(moduleFilePath + '.cjs')) {
                            moduleFilePath += '.cjs';
                        }
                        else if (existsSync(moduleFilePath + '.mjs')) {
                            moduleFilePath += '.mjs';
                        }
                    }
                    if (resolveOnly)
                        return moduleFilePath;
                    return _loadNodeJSModule(moduleFilePath, loadingModules);
                } else {
                    if (!subPath.startsWith('./')) {
                        subPath = './' + subPath;
                    }
                    let realSubPath = getRealSubPath(packageJsonObject.exports[subPath], modulePath);

                    if (!realSubPath) {
                        throw new Error(`Cannot import the module ${modulePath} with subpath ${subPath}`);
                    }

                    if (resolveOnly)
                        return path.resolve(path.join(modulePath, realSubPath.replace('/', path.sep)));
                    return _loadNodeJSModule(
                        path.resolve(path.join(modulePath, realSubPath.replace('/', path.sep))),
                        loadingModules
                    );
                }
            }
        }
        else {
            throw new Error(`Cannot find module: ${modulePath}`);
        }
    }

    async function _loadNodeJSModuleAsync(modulePath: string, loadingModules: any, subPath?: string) {
        if (modulePath.endsWith('.json')) {
            try {
                let jsonContent = await readFile(modulePath, { encoding: 'utf-8' });
                return JSON.parse(jsonContent);
            } catch (e) {
                throw new Error(`Error in loading module ${modulePath}`);
            }
        }

        if ((modulePath.endsWith('.js') || modulePath.endsWith('.cjs') || modulePath.endsWith('.mjs')) && existsSync(modulePath) && (await stat(modulePath)).isFile()) {
            if (loadingModules && loadingModules[path.resolve(modulePath)]) {
                return loadingModules[path.resolve(modulePath)].exports;
            }
            if (moduleCache[path.resolve(modulePath)]) {
                return moduleCache[path.resolve(modulePath)];
            }
            try {
                let rawCode = await readFile(modulePath, { encoding: 'utf-8' });
                if (modulePath.endsWith('.mjs') || modulePath.endsWith('.js')) {
                    rawCode = (await transformAsync(rawCode, {
                        plugins: ['@babel/plugin-transform-modules-commonjs']
                    }))!.code!;
                }

                rawCode = babelGenerator.default(transformImportMeta(parse(rawCode, { sourceType: 'module' }))).code;

                let instrumentedCode;
                if (options && options.instrumentFunc !== undefined) {
                    instrumentedCode = options.instrumentFunc(rawCode, path.resolve(modulePath));
                } else {
                    instrumentedCode = rawCode;
                }

                let ast = parse(instrumentedCode, { sourceFilename: path.resolve(modulePath), sourceType: 'module' });

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
                                    identifier('__dirname'),
                                    identifier('__import'),
                                    identifier('__importmeta')
                                ],
                                blockStatement(
                                    path.node.body,
                                    path.node.directives
                                ),
                                false,
                                true
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

                await compiledFunction.call(
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
                    path.dirname(path.resolve(modulePath)),
                    mockedImport.bind(undefined, path.resolve(modulePath), loadingModules),
                    {
                        dirname: path.dirname(path.resolve(modulePath)),
                        filename: path.resolve(modulePath),
                        url: pathToFileURL(path.resolve(modulePath))
                    }
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
        else if (existsSync(modulePath) && (await stat(modulePath)).isDirectory()) {
            let packageJsonPath = path.resolve(path.join(modulePath, 'package.json'));
            let jsonContent = readFileSync(packageJsonPath, { encoding: 'utf-8' });
            let packageJsonObject = JSON.parse(jsonContent);
            if (!existsSync(packageJsonPath) || !(await stat(packageJsonPath)).isFile()) {
                throw new Error(`Not a moudle: ${modulePath}`);
            }

            if (!subPath) {
                let entryFile = 'index.js';

                if (!packageJsonObject.exports || typeof packageJsonObject.exports === 'string') {
                    if (packageJsonObject.exports) {
                        entryFile = packageJsonObject.exports;
                    }
                    else if (packageJsonObject.main) {
                        entryFile = packageJsonObject.main;
                    }

                    if (!entryFile.endsWith('.js') && !entryFile.endsWith('.cjs') && !entryFile.endsWith('.mjs')) {
                        if (existsSync(path.join(modulePath, entryFile + '.js'))) {
                            entryFile += '.js'
                        }
                        else if (existsSync(path.join(modulePath, entryFile + '.cjs'))) {
                            entryFile += '.cjs'
                        }
                        else if (existsSync(path.join(modulePath, entryFile + '.mjs'))) {
                            entryFile += '.mjs'
                        }
                    }
                    return _loadNodeJSModuleAsync(
                        path.resolve(path.join(modulePath, entryFile)),
                        loadingModules
                    );
                } else {
                    let realEntryFile = getRealSubPath(packageJsonObject.exports, modulePath);
                    if (realEntryFile) {
                        entryFile = realEntryFile;
                    } else {
                        realEntryFile = getRealSubPath(packageJsonObject.exports['.'], modulePath);
                        if (!realEntryFile) {
                            throw new Error(`Cannot import the module ${modulePath} with subpath ${subPath}`);
                        }
                    }
                    entryFile = realEntryFile;
                    return _loadNodeJSModuleAsync(
                        path.resolve(path.join(modulePath, entryFile)),
                        loadingModules
                    );
                }

            }
            else {
                if (!packageJsonObject.exports) {
                    let moduleFilePath = path.resolve(path.join(modulePath, subPath.replace('/', path.sep)));
                    if (!moduleFilePath.endsWith('.js') && !moduleFilePath.endsWith('.cjs')) {
                        if (existsSync(path.join(moduleFilePath, 'index.js')) && (await stat(path.join(moduleFilePath, 'index.js'))).isFile()) {
                            moduleFilePath = path.join(moduleFilePath, 'index.js');
                        }
                        else if (existsSync(moduleFilePath + '.js')) {
                            moduleFilePath += '.js';
                        }
                        else if (existsSync(moduleFilePath + '.cjs')) {
                            moduleFilePath += '.cjs';
                        }
                        else if (existsSync(moduleFilePath + '.mjs')) {
                            moduleFilePath += '.mjs';
                        }
                    }
                    return _loadNodeJSModuleAsync(moduleFilePath, loadingModules);
                } else {
                    if (!subPath.startsWith('./')) {
                        subPath = './' + subPath;
                    }

                    let realSubPath = getRealSubPath(packageJsonObject.exports[subPath], modulePath);

                    if (!realSubPath) {
                        throw new Error(`Cannot import the module ${modulePath} with subpath ${subPath}`);
                    }
                    return _loadNodeJSModuleAsync(
                        path.resolve(path.join(modulePath, realSubPath.replace('/', path.sep))),
                        loadingModules
                    );
                }

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

        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
            if (moduleName.endsWith('.js') || moduleName.endsWith('.cjs')) {
                return _loadNodeJSModule(
                    path.join(path.dirname(currentModulePath), moduleName),
                    loadingModules,
                    undefined,
                    resolveOnly
                );
            }

            let targetModulePaths = [
                path.join(path.dirname(currentModulePath), moduleName + '.js'),
                path.join(path.dirname(currentModulePath), moduleName + '.cjs'),
                path.join(path.dirname(currentModulePath), moduleName + '.mjs'),
                path.join(path.dirname(currentModulePath), moduleName, 'index.js'),
                path.join(path.dirname(currentModulePath), moduleName, 'index.cjs'),
                path.join(path.dirname(currentModulePath), moduleName, 'index.mjs'),
            ];

            for (let p of targetModulePaths) {
                if (existsSync(p)) {
                    return _loadNodeJSModule(p, loadingModules, undefined, resolveOnly);
                }
            }
            throw new Error('Cannot find module.');
        }
        else {
            let moduleNameParts: string[] = moduleName.split('/');
            let d = path.resolve(path.dirname(currentModulePath));
            while (!existsSync(path.join(d, 'node_modules', moduleNameParts[0]!))) {
                if (d === path.join(d, '..')) {
                    break;
                }
                d = path.resolve(path.join(d, '..'));
            }

            let md = path.join(d, 'node_modules');
            let idx = 0;
            let rest = null;
            while (idx < moduleNameParts.length) {
                if (existsSync(path.join(md, moduleNameParts[idx]!)) &&
                    statSync(path.join(md, moduleNameParts[idx]!)).isDirectory()) {
                    md = path.join(md, moduleNameParts[idx]!);
                }
                else if (existsSync(path.join(md, moduleNameParts[idx] + '.js')) &&
                    statSync(path.join(md, moduleNameParts[idx] + '.js')).isFile()) {
                    md = path.join(md, moduleNameParts[idx] + '.js');
                    if (idx !== moduleName.length - 1)
                        throw new Error(`Module not found: ${moduleName}`);
                    break;
                }
                else if (existsSync(path.join(md, moduleNameParts[idx] + '.cjs')) &&
                    statSync(path.join(md, moduleNameParts[idx] + '.cjs')).isFile()) {
                    md = path.join(md, moduleNameParts[idx] + '.cjs');
                    if (idx !== moduleName.length - 1)
                        throw new Error(`Module not found: ${moduleName}`);
                    break;
                }

                idx += 1;
                if (isNodeJSModule(md))
                    break;
            }

            if (idx < moduleNameParts.length) {
                rest = moduleNameParts.slice(idx).join('/');
            }

            if ((md.endsWith('.js') || md.endsWith('.cjs') || md.endsWith('.mjs')) && statSync(md).isFile()) {
                return _loadNodeJSModule(md, loadingModules, undefined, resolveOnly);
            } else {
                return _loadNodeJSModule(md, loadingModules, rest!, resolveOnly);
            }
        }
    }
    


    async function mockedImport(currentModulePath: string, loadingModules: any, moduleName: string) {
        if (moduleName === 'node:module' || moduleName === 'module') {
            return MockedModule;
        }
        if (moduleName.startsWith('node:')) {
            return import(moduleName);
        }
        if (internalModules.indexOf(moduleName) >= 0) {
            return import(moduleName);
        }

        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
            if (moduleName.endsWith('.cjs')) {
                /* Still load synchronously */
                return _loadNodeJSModule(
                    path.join(path.dirname(currentModulePath), moduleName.replace('/', path.sep)),
                    loadingModules
                );
            }

            let targetModulePath = path.join(path.dirname(currentModulePath), moduleName + '.js');

            if (existsSync(targetModulePath)) {
                return _loadNodeJSModuleAsync(targetModulePath, loadingModules);
            }

            targetModulePath = path.join(path.dirname(currentModulePath), moduleName + '.mjs');

            if (existsSync(targetModulePath)) {
                return _loadNodeJSModuleAsync(targetModulePath, loadingModules);
            }

            targetModulePath = path.join(path.dirname(currentModulePath), moduleName);
            if (existsSync(targetModulePath)) {
                return _loadNodeJSModuleAsync(targetModulePath, loadingModules);
            }

            throw new Error('Cannot find module.');
        }
        else {
            let moduleNameParts = moduleName.split('/');
            let d = path.resolve(path.dirname(currentModulePath));
            while (!existsSync(path.join(d, 'node_modules', moduleNameParts[0]!))) {
                if (d === path.join(d, '..')) {
                    break;
                }
                d = path.resolve(path.join(d, '..'));
            }

            let md = path.join(d, 'node_modules');
            let idx = 0;
            let rest = null;
            while (idx < moduleNameParts.length) {
                if (existsSync(path.join(md, moduleNameParts[idx]!)) &&
                    statSync(path.join(md, moduleNameParts[idx]!)).isDirectory()) {
                    md = path.join(md, moduleNameParts[idx]!);
                }
                else if (existsSync(path.join(md, moduleNameParts[idx] + '.js')) &&
                    statSync(path.join(md, moduleNameParts[idx] + '.js')).isFile()) {
                    md = path.join(md, moduleNameParts[idx] + '.js');
                    if (idx !== moduleName.length - 1)
                        throw new Error(`Module not found: ${moduleName}`);
                    break;
                }
                else if (existsSync(path.join(md, moduleNameParts[idx] + '.cjs')) &&
                    statSync(path.join(md, moduleNameParts[idx] + '.cjs')).isFile()) {
                    md = path.join(md, moduleNameParts[idx] + '.cjs');
                    if (idx !== moduleName.length - 1)
                        throw new Error(`Module not found: ${moduleName}`);
                    break;
                }

                idx += 1;
                if (isNodeJSModule(md))
                    break;
            }

            if (idx < moduleNameParts.length) {
                rest = moduleNameParts.slice(idx).join('/');
            }

            if ((md.endsWith('.js') || md.endsWith('.mjs')) && (await stat(md)).isFile()) {
                return _loadNodeJSModuleAsync(md, loadingModules);
            } else if (md.endsWith('.cjs') && (await stat(md)).isFile()) {
                return _loadNodeJSModule(md, loadingModules);
            }
            else {
                return _loadNodeJSModuleAsync(md, loadingModules, rest!);
            }
        }
    }

    if (!async) {
        if (options && options.returnSourceFiles) {
            return [_loadNodeJSModule(modulePath, loadingModules, options.subPath), Array.from(sourceFiles)];
        } else {
            return _loadNodeJSModule(modulePath, loadingModules, options.subPath);
        }

    } else {
        if (options && options.returnSourceFiles) {
            return _loadNodeJSModuleAsync(modulePath, loadingModules, options.subPath).then(m => [m, Array.from(sourceFiles)]);
        } else {
            return _loadNodeJSModuleAsync(modulePath, loadingModules, options.subPath);
        }
    }
}

export default loadNodeJSModule;