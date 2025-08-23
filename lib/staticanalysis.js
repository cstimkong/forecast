/**
 * 
 * This file is part of FesaJS
 */

const fs = require('fs');

const babelParser = require('@babel/parser').default;
const babelTraverse = require('@babel/traverse').default;

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
                    path.node.__evaluateto__ = [];
                    path.node.__funcdef__ = [];
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


function analyze(astMap) {
    for (let filename in astMap) {
        let ast = astMap[filename];
        babelTraverse(ast, {
            enter(path) {
                if (path.isMemberExpression() && ! (path.parentPath.isAssignmentExpression() && path.parentKey === 'left')) {
                    if (path.get('property').node.__tainted__) {
                        path.node.__evaluateto__.push({internalObj: 'Object.prototype'})
                    }
                }
                if (path.isAssignmentExpression()) {
                    if (path.get('left').isIdentifier()) {
                        path.get('left').node.__evaluateto__ = path.get('left').node.__evaluateto__.concat(path.get('right').node.__evaluateto__);
                    }
                }
            }
        })
    }
}

// module.exports = { analyze };