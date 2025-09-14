/**
 * 
 * This file is part of FesaJS
 */

import fs from 'fs';

import babelParser from '@babel/parser';
import babelTraverse, { Node } from '@babel/traverse';
import babelGenerator from '@babel/generator';
import objectHash from 'object-hash';
import { ProgramLocation, ObjectCreationLocation, Hint, HintType } from './sourcecode.js';


function getRuntimeHints(runtimeHints: Hint[], sourceCodeStart: number, sourceCodeEnd: number) {
    let result = [];
    for (let item of runtimeHints) {
        if (item.start.index === sourceCodeStart && item.end.index == sourceCodeEnd) {
            result.push({value: item.content.value, type: item.content.type});
        }
    }
    return result;
}

function searchNode(ast: any, source: ObjectCreationLocation): Node | undefined {
    babelTraverse.default(ast, {
        enter(path) {
            if (path.node.start === source.start.index && path.node.end === source.end.index) {
                return path.node
            }
        }
    })
    return undefined;
}

/**
 * 
 * Attach the runtime hints to the AST
 * @param {Array} fileSet 
 * @param {Array} runtimeHints 
 * @returns 
 */
function attachRuntimeHints(fileSet: Array<string>, runtimeHints: Hint[]) {
    let astMap: any = {}
    for (let f of fileSet) {
        let content = fs.readFileSync(f, {encoding: 'utf-8'});
        let ast = babelParser.parse(content, { sourceFilename: f });
        babelTraverse.default(ast, {
            exit: function(path) {
                if (path.isExpression()) {
                    let hints = getRuntimeHints(runtimeHints, path.node.start!, path.node.end!);
                    (path.node as any).__hints__ = hints;
                    (path.node as any).__evaluateto__ = {};
                    (path.node as any).__funcdef__ = {};
                    for (let h of hints) {
                        if (h.type === 'taintInfo') {
                            (path.node as any).__tainted__ = true;
                            break;
                        }
                        else if (h.type === 'objectCreation') {
                            if (h.value.prototype) {
                                (path.node as any).__prototype__ = h.value.prototype;
                            }
                        }
                    }
                    
                }
            }
        });
        astMap[f] = ast;
    }
    return astMap;
}

function propagate(astMap: NodeJS.Dict<any>): Array<any>{
    // let updates = [];
    for (let filename in astMap) {
        let ast = astMap[filename];
        babelTraverse.default(ast, {
            enter(path) {
                if (path.isMemberExpression() && ! (path.parentPath.isAssignmentExpression() && path.parentKey === 'left')) {
                    if ((path.get('property').node as any).__tainted__) {
                        if ((path.get('object').node as any).__prototype__ === 'Object.prototype') {
                            let v = {internalObj: 'Object.prototype'};
                            (path.node as any).__evaluateto__[objectHash(v)] = v;
                        }
                    }
                }

                if (path.isAssignmentExpression()) {
                    if (path.get('left').isIdentifier()) {
                        for (let [k, v] of Object.entries((path.get('right').node as any).__evaluateto__)) {
                            (path.get('left').node as any).__evaluateto__[k] = v;
                        }
                    }
                    if (path.get('left').isExpression() && (path.get('left').node as any).__evaluateto__.hasOwnProperty(objectHash({internalObj: 'Object.prototyoe'}))) {
                        if ((path.get('right').node as any).__tainted__) {
                            /* Report prototype pollution */
                            console.log({taintPosition: path.node.loc, content: babelGenerator.default(path.node).code});
                        }
                    }
                }
            }
        })
    }
    // TODO
    return [];
    // return updates;
}

export function solve(sourceFiles: Array<string>, runtimeHints: Hint[]) {
    let astMap = attachRuntimeHints(sourceFiles, runtimeHints);
    while (true) {
        let updates = propagate(astMap);
        if (!updates || updates.length === 0) {
            break;
        }
    }
    return astMap;
}
