/**
 *  This file is part of FesaJS.
 */

'use strict';

const babelTraverse = require('@babel/traverse').default;
const babelParser = require('@babel/parser');
const babelTypes = require('@babel/types');
const babelGenerator = require('@babel/generator').default;

/**
 * 
 * @param {String} source Source code string
 * @returns 
 */
function instrumentCodeForForcedExecution(source, filename) {

    let ast = babelParser.parse(source, { sourceFilename: filename });

    babelTraverse(ast, {
        exit: function (path, state) {
            if (path.isMemberExpression()) {
                if (path.get('property').isExpression() && path.node.computed) {
                    let newFuncExpr = babelTypes.functionExpression(null, [babelTypes.identifier('x')], babelTypes.blockStatement(
                        [
                            babelTypes.ifStatement(
                                babelTypes.logicalExpression('&&',
                                    babelTypes.logicalExpression('&&',
                                        babelTypes.binaryExpression('===',
                                            babelTypes.unaryExpression('typeof', babelTypes.identifier('x')),
                                            babelTypes.stringLiteral('object')
                                        ),
                                        babelTypes.binaryExpression('!==',
                                            babelTypes.identifier('x'),
                                            babelTypes.nullLiteral()
                                        )
                                    ),
                                    babelTypes.memberExpression(
                                        babelTypes.identifier('x'),
                                        babelTypes.identifier('__tainted__'),
                                        false
                                    )
                                ),
                                babelTypes.expressionStatement(
                                    babelTypes.callExpression(
                                        babelTypes.identifier('__record__'),
                                        [
                                            babelTypes.objectExpression(
                                                [
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('line'),
                                                        babelTypes.numericLiteral(path.get('property').node.loc.start.line),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('column'),
                                                        babelTypes.numericLiteral(path.get('property').node.loc.start.column),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('index'),
                                                        babelTypes.numericLiteral(path.get('property').node.start),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            babelTypes.objectExpression(
                                                [
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('line'),
                                                        babelTypes.numericLiteral(path.get('property').node.loc.end.line),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('column'),
                                                        babelTypes.numericLiteral(path.get('property').node.loc.end.column),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('index'),
                                                        babelTypes.numericLiteral(path.get('property').node.end),
                                                        false
                                                    )
                                                ]
                                            ),

                                            typeof filename == 'string' ? babelTypes.stringLiteral(filename) : babelTypes.identifier('undefined'),
                                            babelTypes.stringLiteral('TAINTED_ACCESS_PROP')
                                        ]

                                    )
                                )
                            ),
                            babelTypes.returnStatement(
                                babelTypes.identifier('x')
                            )
                        ]
                    ));
                    let newFuncCallExpr = babelTypes.callExpression(
                        babelTypes.parenthesizedExpression(newFuncExpr),
                        [path.node.property]
                    );

                    newFuncCallExpr.start = path.get('property').node.start;
                    newFuncCallExpr.end = path.get('property').node.end;
                    newFuncCallExpr.loc = {
                        start: {
                            index: path.get('property').node.loc.start.index,
                            line: path.get('property').node.loc.start.line,
                            column: path.get('property').node.loc.start.column
                        },
                        end: {
                            index: path.get('property').node.loc.end.index,
                            line: path.get('property').node.loc.end.line,
                            column: path.get('property').node.loc.end.column
                        }
                    };
                    path.get('property').replaceWith(newFuncCallExpr);

                    path.skip();
                }
                path.skip();
            }
            else if (path.isAssignmentExpression()) {
                let newFuncExpr = babelTypes.functionExpression(null,
                    [babelTypes.identifier('x')],
                    babelTypes.blockStatement(
                        [
                            babelTypes.ifStatement(
                                babelTypes.logicalExpression('&&',
                                    babelTypes.logicalExpression('&&',
                                        babelTypes.binaryExpression('===',
                                            babelTypes.unaryExpression('typeof', babelTypes.identifier('x')),
                                            babelTypes.stringLiteral('object')
                                        ),
                                        babelTypes.binaryExpression('!==',
                                            babelTypes.identifier('x'),
                                            babelTypes.nullLiteral()
                                        )
                                    ),
                                    babelTypes.memberExpression(
                                        babelTypes.identifier('x'),
                                        babelTypes.identifier('__tainted__'),
                                        false
                                    )
                                ),
                                babelTypes.expressionStatement(
                                    babelTypes.callExpression(
                                        babelTypes.identifier('__record__'),
                                        [
                                            babelTypes.objectExpression(
                                                [
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('line'),
                                                        babelTypes.numericLiteral(path.get('right').node.loc.start.line),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('column'),
                                                        babelTypes.numericLiteral(path.get('right').node.loc.start.column),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('index'),
                                                        babelTypes.numericLiteral(path.get('right').node.start),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            babelTypes.objectExpression(
                                                [
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('line'),
                                                        babelTypes.numericLiteral(path.get('right').node.loc.end.line),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('column'),
                                                        babelTypes.numericLiteral(path.get('right').node.loc.end.column),
                                                        false
                                                    ),
                                                    babelTypes.objectProperty(
                                                        babelTypes.identifier('index'),
                                                        babelTypes.numericLiteral(path.get('right').node.end),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            typeof filename === 'string' ? babelTypes.stringLiteral(filename) : babelTypes.identifier('undefined'),
                                            babelTypes.stringLiteral('TAINTED_WRITTEN_VALUE')
                                        ]

                                    )
                                )
                            ),
                            babelTypes.returnStatement(
                                babelTypes.identifier('x')
                            )
                        ]
                    )
                );
                let newFuncCallExpr = babelTypes.callExpression(
                    babelTypes.parenthesizedExpression(newFuncExpr),
                    [path.node.right]
                );
                newFuncCallExpr.start = path.get('right').node.start;
                newFuncCallExpr.end = path.get('right').node.end;
                newFuncCallExpr.loc = {
                    start: {
                        index: path.get('right').node.loc.start.index,
                        line: path.get('right').node.loc.start.line,
                        column: path.get('right').node.loc.start.column
                    },
                    end: {
                        index: path.get('right').node.loc.end.index,
                        line: path.get('right').node.loc.end.line,
                        column: path.get('right').node.loc.end.column
                    }
                };
                path.get('right').replaceWith(newFuncCallExpr);
                path.skip();
            }

            else if (path.isUnaryExpression() && path.node.operator === 'typeof') {
                if (path.get('argument').isIdentifier()) {
                    let newConditionalExpr = babelTypes.conditionalExpression(
                        babelTypes.binaryExpression('!==',
                            babelTypes.unaryExpression('typeof', path.get('argument').node),
                            babelTypes.stringLiteral('object')
                        ),
                        babelTypes.unaryExpression('typeof', path.get('argument').node),
                        babelTypes.conditionalExpression(
                            babelTypes.memberExpression(
                                path.get('argument').node,
                                babelTypes.identifier('__tainted__'),
                                false
                            ),
                            babelTypes.memberExpression(
                                path.get('argument').node,
                                babelTypes.identifier('__typeof__'),
                                false
                            ),
                            babelTypes.stringLiteral('object')
                        )

                    )

                    newConditionalExpr.start = path.node.start;
                    newConditionalExpr.end = path.node.end;
                    newConditionalExpr.loc = {
                        start: {
                            index: path.node.loc.start.index,
                            line: path.node.loc.start.line,
                            column: path.node.loc.start.column
                        },
                        end: {
                            index: path.node.loc.end.index,
                            line: path.node.loc.end.line,
                            column: path.node.loc.end.column
                        }
                    };
                    path.replaceWith(newConditionalExpr);
                    path.skip();
                }
            }

            else if (path.isBinaryExpression() && path.node.operator === '+') {
                let funcExpr = babelParser.parseExpression(
                    '(function(a, b) { return  ((typeof a === \'object\' && a.__tainted__) || (typeof b === \'object\' && b.__tainted__)) ? __makeProxyString__(a + b) : a + b; })'
                );
                let callExpr = babelTypes.callExpression(
                    babelTypes.parenthesizedExpression(
                        funcExpr
                    ),
                    [path.get('left').node, path.get('right').node]
                );
                callExpr.start = path.node.start;
                callExpr.end = path.node.end;

                callExpr.start = path.node.start;
                callExpr.end = path.node.end;
                callExpr.loc = {
                    start: {
                        index: path.node.loc.start.index,
                        line: path.node.loc.start.line,
                        column: path.node.loc.start.column
                    },
                    end: {
                        index: path.node.loc.end.index,
                        line: path.node.loc.end.line,
                        column: path.node.loc.end.column
                    }
                };

                path.replaceWith(callExpr);
                path.skip();
            }

            /* Limit the iteration count */
            else if (path.isWhileStatement() || path.isForStatement()) {
                path.get('test').replaceWith(
                    babelTypes.logicalExpression('&&',
                        babelTypes.callExpression(
                            babelTypes.parenthesizedExpression(
                                babelTypes.functionExpression(
                                    null,
                                    [babelTypes.identifier('x')],
                                    babelTypes.blockStatement(
                                        [
                                            babelTypes.ifStatement(
                                                babelTypes.binaryExpression('<', babelTypes.identifier('x'), babelTypes.numericLiteral(10000)),
                                                babelTypes.returnStatement(babelTypes.booleanLiteral(true))
                                            ),
                                            babelTypes.throwStatement(
                                                babelTypes.newExpression(babelTypes.identifier('Error'), [babelTypes.stringLiteral('Loop limit')])
                                            )
                                        ]
                                    )
                                )
                            ),
                            [babelTypes.identifier('__loopguard__')]
                        ),
                        path.get('test').node
                    )
                );
                path.get('body').replaceWith(
                    babelTypes.blockStatement(
                        [
                            path.get('body').node,
                            babelTypes.expressionStatement(
                                babelTypes.assignmentExpression('+=',
                                    babelTypes.identifier('__loopguard__'),
                                    babelTypes.numericLiteral(1)
                                )
                            )
                        ]
                    )
                );
                let newBlock = babelTypes.blockStatement([
                    babelTypes.variableDeclaration("let", [
                        babelTypes.variableDeclarator(
                            babelTypes.identifier('__loopguard__'),
                            babelTypes.numericLiteral(0)
                        )
                    ]),
                    path.node
                ]);
                path.replaceWith(newBlock);
                path.skip();
            }

            else if (path.isCallExpression()) {
                if (path.get('callee').isMemberExpression() && path.get('callee').get('object').isIdentifier()) {
                    let calleeName = path.get('callee').get('object').node.name;
                    if (calleeName === 'Object' || calleeName === 'String') {
                        return;
                    }
                }
                let newCallExpr = babelTypes.callExpression(
                    babelTypes.parenthesizedExpression(
                        babelTypes.functionExpression(
                            null,
                            [babelTypes.identifier('x')],
                            babelTypes.blockStatement(
                                [
                                    babelTypes.expressionStatement(
                                        babelTypes.callExpression(
                                            babelTypes.identifier('__record__'),
                                            [
                                                babelTypes.objectExpression(
                                                    [
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('line'),
                                                            babelTypes.numericLiteral(path.get('callee').node.loc.start.line),
                                                            false
                                                        ),
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('column'),
                                                            babelTypes.numericLiteral(path.get('callee').node.loc.start.column),
                                                            false
                                                        ),
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('index'),
                                                            babelTypes.numericLiteral(path.get('callee').node.start),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                babelTypes.objectExpression(
                                                    [
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('line'),
                                                            babelTypes.numericLiteral(path.get('callee').node.loc.end.line),
                                                            false
                                                        ),
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('column'),
                                                            babelTypes.numericLiteral(path.get('callee').node.loc.end.column),
                                                            false
                                                        ),
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('index'),
                                                            babelTypes.numericLiteral(path.get('callee').node.end),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                typeof filename === 'string' ? babelTypes.stringLiteral(filename) : babelTypes.identifier('undefined'),
                                                babelTypes.objectExpression(
                                                    [
                                                        babelTypes.objectProperty(
                                                            babelTypes.identifier('defLocation'),
                                                            babelTypes.memberExpression(
                                                                babelTypes.identifier('x'),
                                                                babelTypes.identifier('__deflocation__'),
                                                                false
                                                            )
                                                        )
                                                    ]
                                                )
                                            ]

                                        )
                                    ),
                                    babelTypes.returnStatement(babelTypes.identifier('x'))
                                ]
                            )
                        )
                    ),
                    [path.get('callee').node]
                );

                newCallExpr.start = path.get('callee').node.start;
                newCallExpr.end = path.get('callee').node.end;
                newCallExpr.loc = {
                    start: {
                        index: path.get('callee').node.loc.start.index,
                        line: path.get('callee').node.loc.start.line,
                        column: path.get('callee').node.loc.start.column
                    },
                    end: {
                        index: path.get('callee').node.loc.end.index,
                        line: path.get('callee').node.loc.end.line,
                        column: path.get('callee').node.loc.end.column
                    }
                };
                path.get('callee').replaceWith(newCallExpr);
                path.skip();
            }

            else if (path.isProgram()) {
                let funcExpr = babelTypes.functionExpression(
                    null,
                    [
                        babelTypes.identifier('module'),
                        babelTypes.identifier('exports'),
                        babelTypes.identifier('require'),
                        babelTypes.identifier('__filename'),
                        babelTypes.identifier('__dirname'),
                        babelTypes.identifier('__record__')
                    ],
                    babelTypes.blockStatement(
                        path.node.body,
                        path.node.directives
                    )
                );

                path.node.body = [babelTypes.parenthesizedExpression(funcExpr)];
                path.node.directives = [];
                path.skip();

            }

        }
    });

    return babelGenerator(ast).code;
}

function isTainted(start, end, taintInfo) {
    for (let e of taintInfo) {
        if (start === e.start && end === e.end) {
            return true;
        }
    }
    return false;
}

/**
 * Instrument the source code for tainted expressions
 * 
 * @param {String} sourceCode 
 * @param {Array} taintInfo 
 */
function instrumentCodeWithTaints(sourceCode, taintInfo) {
    let ast = babelParser.parse(sourceCode);
    babelTraverse(ast, {
        exit: function (path) {
            if (isTainted(path.node.start, path.node.end, taintInfo)) {
                path.replaceWith(
                    babelTypes.callExpression(
                        babelTypes.functionExpression(
                            null,
                            [babelTypes.identifier('x')],
                            babelTypes.blockStatement(
                                [
                                    babelTypes.callExpression(
                                        babelTypes.identifier('__record__'),
                                        [babelTypes.identifier('x')]
                                    ),
                                    babelTypes.returnStatement(babelTypes.identifier('x'))
                                ]
                            )
                        ),
                        [path.node]
                    )
                )
                path.skip()
            }
        }
    })
}

module.exports = { instrumentCodeForForcedExecution, instrumentCodeWithTaints };
