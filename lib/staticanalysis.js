/**
 * 
 * This file is part of FesaJS
 */

import fs from 'fs';

import babelParser from '@babel/parser';
import babelTraverse from ('@babel/traverse');
import babelGenerator from '@babel/generator';
import objectHash from 'object-hash';

function getRuntimeHints(runtimeHints, sourceCodeStart, sourceCodeEnd) {
    let result = [];
    for (let item of runtimeHints) {
        if (item.start === sourceCodeStart && item.end == sourceCodeEnd) {
            result.push({value: item.value, type: item.type});
        }
    }
    return result;
}

/**
 * 
 * Attach the runtime hints to the AST
 * @param {Array} fileSet 
 * @param {Array} runtimeHints 
 * @returns 
 */
function attachRuntimeHints(fileSet, runtimeHints) {
    let astMap = {}
    for (let f of fileSet) {
        let content = fs.readFileSync(f, {encoding: 'utf-8'});
        let ast = babelParser.parse(content, { sourceFilename: f });
        babelTraverse(ast, {
            exit: function(path) {
                if (path.isExpression()) {
                    let hints = getRuntimeHints(runtimeHints, path.node.start, path.node.end);
                    path.node.__hints__ = hints;
                    path.node.__evaluateto__ = {};
                    path.node.__funcdef__ = {};
                    for (let h of path.node.__hints__) {
                        if (h.type === 'taintInfo') {
                            path.node.__tainted__ = true;
                            break;
                        }
                    }
                    
                }
            }
        });
        astMap[f] = ast;
    }
    return astMap;
}

function propagate(astMap) {
    let updates = [];
    for (let filename in astMap) {
        let ast = astMap[filename];
        babelTraverse(ast, {
            enter(path) {
                if (path.isMemberExpression() && ! (path.parentPath.isAssignmentExpression() && path.parentKey === 'left')) {
                    if (path.get('property').node.__tainted__) {
                        let v = {internalObj: 'Object.prototype'};
                        path.node.__evaluateto__[objectHash(v)] = v;
                    }
                }

                if (path.isAssignmentExpression()) {
                    if (path.get('left').isIdentifier()) {
                        for (let [k, v] of Object.entries(path.get('right').node.__evaluateto__)) {
                            path.get('left').node.__evaluateto__[k] = v;
                        }
                    }
                    if (path.get('left').isExpression() && path.get('left').node.__evaluateto__.hasOwnProperty(objectHash({internalObj: 'Object.prototyoe'}))) {
                        if (path.get('right').node.__tainted__) {
                            /* Report prototype pollution */
                            console.log({taintPosition: path.node.loc, content: babelGenerator.default(path.node).code});
                        }
                    }
                }
            }
        })
    }
    return updates;
}

export function solve(sourceFiles, runtimeHints) {
    let astMap = attachRuntimeHints(sourceFiles, runtimeHints);
    while (true) {
        let updates = propagate(astMap);
        if (!updates || updates.length === 0) {
            break;
        }
    }
    return astMap;
}
