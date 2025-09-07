/**
 *  This file is part of FesaJS.
 */

import babelTraverse, { NodePath } from '@babel/traverse';
import { parse, parseExpression } from '@babel/parser';
import {identifier,
    functionExpression,
    parenthesizedExpression,
    stringLiteral,
    numericLiteral,
    booleanLiteral,
    nullLiteral,
    callExpression,
    memberExpression,
    objectExpression,
    objectProperty,
    unaryExpression,
    binaryExpression,
    logicalExpression,
    conditionalExpression,
    newExpression,
    returnStatement,
    blockStatement,
    expressionStatement,
    ifStatement,
    throwStatement,
    assignmentExpression,
    variableDeclaration,
    variableDeclarator,
    Statement,
    Expression,
    BinaryExpression,
    Identifier,
    MemberExpression
} from '@babel/types';
import babelGenerator from '@babel/generator';

export type ProgramLocation = {
    line: number,
    column: number,
    index: number
}

export type TaintInfo = {
    start: ProgramLocation,
    end: ProgramLocation,
    filename: string,
    type: string
}

/**
 * 
 * @param {String} source Source code string
 * @param {String | undefined} filename File name of the code
 * @param {Object} opts options
 * @returns 
 */
export function instrumentCodeForForcedExecution(source: string, filename: string, opts: any) {

    let ast = parse(source, { sourceFilename: filename });

    babelTraverse(ast, {
        enter: function (path) {
            /* Function hoisting */
            if (path.isProgram() || path.isBlockStatement()) {
                let functionDecls: Array<Statement> = [];
                let otherStatements = [];
                for (let item of path.node.body) {
                    if (item.type === 'FunctionDeclaration') {
                        functionDecls.push(item);
                    } else {
                        otherStatements.push(item);
                    }
                }
                path.node.body = functionDecls.concat(otherStatements);
            }
        },

        exit: function (path, state) {
            if (path.isMemberExpression() && !(path.parentPath.isAssignmentExpression() && path.parentKey === 'left')) {
                if (path.get('property').isExpression() && path.node.computed) {
                    let newFuncExpr = functionExpression(null, [identifier('x')], blockStatement(
                        [
                            ifStatement(
                                logicalExpression('&&',
                                    logicalExpression('&&',
                                        binaryExpression('===',
                                            unaryExpression('typeof', identifier('x')),
                                            stringLiteral('object')
                                        ),
                                        binaryExpression('!==',
                                            identifier('x'),
                                            nullLiteral()
                                        )
                                    ),
                                    memberExpression(
                                        identifier('x'),
                                        identifier('__tainted__'),
                                        false
                                    )
                                ),
                                expressionStatement(
                                    callExpression(
                                        identifier('__record__'),
                                        [
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('line'),
                                                        numericLiteral(path.get('property').node.loc!.start.line),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('column'),
                                                        numericLiteral(path.get('property').node.loc!.start.column),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('index'),
                                                        numericLiteral(path.get('property').node.start!),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('line'),
                                                        numericLiteral(path.get('property').node.loc!.end.line),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('column'),
                                                        numericLiteral(path.get('property').node.loc!.end.column),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('index'),
                                                        numericLiteral(path.get('property').node.end!),
                                                        false
                                                    )
                                                ]
                                            ),

                                            typeof filename == 'string' ? stringLiteral(filename) : identifier('undefined'),
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('type'),
                                                        stringLiteral('taintInfo')
                                                    ),
                                                    objectProperty(
                                                        identifier('value'),
                                                        stringLiteral('TAINTED_ACCESS_PROP')
                                                    )
                                                ]
                                            )
                                        ]

                                    )
                                )
                            ),
                            returnStatement(
                                identifier('x')
                            )
                        ]
                    ));
                    let newFuncCallExpr: any = callExpression(
                        parenthesizedExpression(newFuncExpr),
                        [path.node.property as Expression]
                    );

                    newFuncCallExpr.start = path.get('property').node.start;
                    newFuncCallExpr.end = path.get('property').node.end;
                    newFuncCallExpr.loc = {
                        start: {
                            index: path.get('property').node.loc!.start.index,
                            line: path.get('property').node.loc!.start.line,
                            column: path.get('property').node.loc!.start.column
                        },
                        end: {
                            index: path.get('property').node.loc!.end.index,
                            line: path.get('property').node.loc!.end.line,
                            column: path.get('property').node.loc!.end.column
                        }
                    };
                    path.get('property').replaceWith(newFuncCallExpr);

                    path.skip();
                }
            }

            else if (path.isAssignmentExpression()) {
                let newFuncExpr = functionExpression(null,
                    [identifier('x')],
                    blockStatement(
                        [
                            ifStatement(
                                logicalExpression('&&',
                                    logicalExpression('&&',
                                        binaryExpression('===',
                                            unaryExpression('typeof', identifier('x')),
                                            stringLiteral('object')
                                        ),
                                        binaryExpression('!==',
                                            identifier('x'),
                                            nullLiteral()
                                        )
                                    ),
                                    memberExpression(
                                        identifier('x'),
                                        identifier('__tainted__'),
                                        false
                                    )
                                ),
                                expressionStatement(
                                    callExpression(
                                        identifier('__record__'),
                                        [
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('line'),
                                                        numericLiteral(path.get('right').node.loc!.start.line),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('column'),
                                                        numericLiteral(path.get('right').node.loc!.start.column),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('index'),
                                                        numericLiteral(path.get('right').node.start!),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('line'),
                                                        numericLiteral(path.get('right').node.loc!.end.line),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('column'),
                                                        numericLiteral(path.get('right').node.loc!.end.column),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('index'),
                                                        numericLiteral(path.get('right').node.end!),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            typeof filename === 'string' ? stringLiteral(filename) : identifier('undefined'),
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('type'),
                                                        stringLiteral('taintInfo')
                                                    ),
                                                    objectProperty(
                                                        identifier('value'),
                                                        stringLiteral('TAINTED_WRITTEN_VALUE')
                                                    )
                                                ]
                                            )
                                        ]
                                    )
                                )
                            ),
                            returnStatement(
                                identifier('x')
                            )
                        ]
                    )
                );
                let newFuncCallExpr: any = callExpression(
                    parenthesizedExpression(newFuncExpr),
                    [path.node.right]
                );
                newFuncCallExpr.start = path.get('right').node.start;
                newFuncCallExpr.end = path.get('right').node.end;
                newFuncCallExpr.loc = {
                    start: {
                        index: path.get('right').node.loc!.start.index,
                        line: path.get('right').node.loc!.start.line,
                        column: path.get('right').node.loc!.start.column
                    },
                    end: {
                        index: path.get('right').node.loc!.end.index,
                        line: path.get('right').node.loc!.end.line,
                        column: path.get('right').node.loc!.end.column
                    }
                };
                path.get('right').replaceWith(newFuncCallExpr);

                if (path.get('left').isMemberExpression()) {
                    let objectReplacement = callExpression(
                        parenthesizedExpression(
                            functionExpression(
                                null,
                                [identifier('e')],
                                blockStatement(
                                    [
                                        expressionStatement(
                                            callExpression(
                                                identifier('__record__'),
                                                [
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('line'),
                                                                numericLiteral(path.get('left').get('object').node.loc!.start.line),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('column'),
                                                                numericLiteral(path.get('left').get('object').node.loc!.start.column),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('index'),
                                                                numericLiteral(path.get('left').get('object').node.start!),
                                                                false
                                                            ),
                                                        ]
                                                    ),
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('line'),
                                                                numericLiteral(path.get('left').get('object').node.loc!.end.line),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('column'),
                                                                numericLiteral(path.get('left').get('object').node.loc!.end.column),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('index'),
                                                                numericLiteral(path.get('left').get('object').node.end!),
                                                                false
                                                            )
                                                        ]
                                                    ),

                                                    typeof filename == 'string' ? stringLiteral(filename) : identifier('undefined'),
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('type'),
                                                                stringLiteral('objectCreation')
                                                            ),
                                                            objectProperty(
                                                                identifier('value'),
                                                                callExpression(
                                                                    identifier('__getcreationlocation__'),
                                                                    [identifier('e')]
                                                                )
                                                            )
                                                        ]
                                                    )
                                                ]

                                            )
                                        ),
                                        returnStatement(identifier('e'))
                                    ]
                                )
                            )

                        ),
                        [path.get('left').get('object').node]
                    );

                    path.get('left').get('object').replaceWith(objectReplacement);
                }

                path.skip();
            }

            else if (path.isUnaryExpression() && path.node.operator === 'typeof') {
                if (path.get('argument').isIdentifier()) {
                    let newConditionalExpr: any = conditionalExpression(
                        binaryExpression('!==',
                            unaryExpression('typeof', path.get('argument').node),
                            stringLiteral('object')
                        ),
                        unaryExpression('typeof', path.get('argument').node),
                        conditionalExpression(
                            memberExpression(
                                path.get('argument').node,
                                identifier('__tainted__'),
                                false
                            ),
                            memberExpression(
                                path.get('argument').node,
                                identifier('__typeof__'),
                                false
                            ),
                            stringLiteral('object')
                        )

                    )

                    newConditionalExpr.start = path.node.start;
                    newConditionalExpr.end = path.node.end;
                    newConditionalExpr.loc = {
                        start: {
                            index: path.node.loc!.start.index,
                            line: path.node.loc!.start.line,
                            column: path.node.loc!.start.column
                        },
                        end: {
                            index: path.node.loc!.end.index,
                            line: path.node.loc!.end.line,
                            column: path.node.loc!.end.column
                        }
                    };
                    path.replaceWith(newConditionalExpr);
                    path.skip();
                }
            }

            else if (path.isObjectExpression() || path.isNewExpression()) {
                let newCallExpr: any = callExpression(
                    memberExpression(
                        identifier('Object'),
                        identifier('defineProperty')
                    ),
                    [
                        path.node,
                        stringLiteral('__creationlocation__'),
                        objectExpression(
                            [
                                objectProperty(
                                    identifier('enumerable'),
                                    booleanLiteral(false)
                                ),
                                objectProperty(
                                    identifier('configurable'),
                                    booleanLiteral(false)
                                ),
                                objectProperty(
                                    identifier('value'),
                                    objectExpression(
                                        [
                                            objectProperty(
                                                identifier('start'),
                                                objectExpression(
                                                    [
                                                        objectProperty(
                                                            identifier('line'),
                                                            numericLiteral(path.node.loc!.start.line),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('column'),
                                                            numericLiteral(path.node.loc!.start.column),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('index'),
                                                            numericLiteral(path.node.start!),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                false
                                            ),
                                            objectProperty(
                                                identifier('end'),
                                                objectExpression(
                                                    [
                                                        objectProperty(
                                                            identifier('line'),
                                                            numericLiteral(path.node.loc!.end.line),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('column'),
                                                            numericLiteral(path.node.loc!.end.column),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('index'),
                                                            numericLiteral(path.node.end!),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                false
                                            ),
                                            objectProperty(
                                                identifier('filename'),
                                                typeof filename == 'string' ? stringLiteral(filename) : identifier('undefined')
                                            )
                                        ]
                                    )
                                )
                            ]
                        )

                    ]
                );

                newCallExpr.start = path.node.start;
                newCallExpr.end = path.node.end;
                newCallExpr.loc = {
                    start: {
                        index: path.node.loc!.start.index,
                        line: path.node.loc!.start.line,
                        column: path.node.loc!.start.column
                    },
                    end: {
                        index: path.node.loc!.end.index,
                        line: path.node.loc!.end.line,
                        column: path.node.loc!.end.column
                    }
                };

                path.replaceWith(newCallExpr);
                path.skip();
            }

            else if (path.isBinaryExpression() && path.node.operator === '+') {
                let funcExpr = parseExpression(
                    '(function(a, b) { return  ((typeof a === \'object\' && a.__tainted__) || (typeof b === \'object\' && b.__tainted__)) ? __makeProxyString__(a + b) : a + b; })'
                );
                let callExpr: any = callExpression(
                    parenthesizedExpression(
                        funcExpr
                    ),
                    [(path.get('left') as NodePath<Expression>).node, path.get('right').node]
                );
                callExpr.start = path.node.start;
                callExpr.end = path.node.end;

                callExpr.start = path.node.start;
                callExpr.end = path.node.end;
                callExpr.loc = {
                    start: {
                        index: path.node.loc!.start.index,
                        line: path.node.loc!.start.line,
                        column: path.node.loc!.start.column
                    },
                    end: {
                        index: path.node.loc!.end.index,
                        line: path.node.loc!.end.line,
                        column: path.node.loc!.end.column
                    }
                };

                path.replaceWith(callExpr);
                path.skip();
            }

            /* Limit the iteration count */
            else if (path.isWhileStatement() || path.isForStatement()) {
                if (!opts || !opts.maxLoop) {
                    return;
                }
                (path.get('test') as NodePath<Statement>).replaceWith(
                    logicalExpression('&&',
                        callExpression(
                            parenthesizedExpression(
                                functionExpression(
                                    null,
                                    [identifier('x')],
                                    blockStatement(
                                        [
                                            ifStatement(
                                                binaryExpression('<', identifier('x'), numericLiteral(Number(opts.maxLoop))),
                                                returnStatement(booleanLiteral(true))
                                            ),
                                            throwStatement(
                                                newExpression(identifier('Error'), [stringLiteral('Loop limit')])
                                            )
                                        ]
                                    )
                                )
                            ),
                            [identifier('__loopguard__')]
                        ),
                        (path.get('test') as NodePath<Expression>).node
                    )
                );
                (path.get('body') as NodePath<Statement>).replaceWith(
                    blockStatement(
                        [
                            (path.get('body') as NodePath<Statement>).node,
                            expressionStatement(
                                assignmentExpression('+=',
                                    identifier('__loopguard__'),
                                    numericLiteral(1)
                                )
                            )
                        ]
                    )
                );
                let newBlock = blockStatement([
                    variableDeclaration("let", [
                        variableDeclarator(
                            identifier('__loopguard__'),
                            numericLiteral(0)
                        )
                    ]),
                    path.node
                ]);
                path.replaceWith(newBlock);
                path.skip();
            }

            /* Instrumentation for recording the function values in calls */
            else if (path.isCallExpression()) {
                if (path.get('callee').isMemberExpression() && path.get('callee').get('object').isIdentifier()) {
                    let calleeName = (path.get('callee').get('object').node as Identifier).name;
                    if (calleeName === 'Object' || calleeName === 'String' || calleeName === 'Array' || calleeName === 'Number' || calleeName === 'RegExp') {
                        return;
                    }
                }

                if (path.get('callee').isIdentifier()) {
                    if (['Array', 'String', 'Object', 'Number'].indexOf((path.get('callee').node as Identifier).name) >= 0) {
                        return;
                    }
                }
                let newCallExpr: any;
                if (path.get('callee').isMemberExpression() && !(path.get('callee').node as MemberExpression).computed) {
                    let o = path.get('callee').get('object').node;
                    newCallExpr = callExpression(
                        parenthesizedExpression(
                            functionExpression(
                                null,
                                [identifier('e')],
                                blockStatement(
                                    [
                                        variableDeclaration("const",
                                            [
                                                variableDeclarator(
                                                    identifier('f'),
                                                    memberExpression(
                                                        identifier('e'),
                                                        path.get('callee').get('property').node
                                                    )
                                                )
                                            ]
                                        ),
                                        expressionStatement(
                                            callExpression(
                                                identifier('__record__'),
                                                [
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('line'),
                                                                numericLiteral(path.get('callee').node.loc!.start.line),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('column'),
                                                                numericLiteral(path.get('callee').node.loc!.start.column),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('index'),
                                                                numericLiteral(path.get('callee').node.start!),
                                                                false
                                                            ),
                                                        ]
                                                    ),
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('line'),
                                                                numericLiteral(path.get('callee').node.loc!.end.line),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('column'),
                                                                numericLiteral(path.get('callee').node.loc!.end.column),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('index'),
                                                                numericLiteral(path.get('callee').node.end!),
                                                                false
                                                            ),
                                                        ]
                                                    ),
                                                    typeof filename === 'string' ? stringLiteral(filename) : identifier('undefined'),
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('type'),
                                                                stringLiteral('funcDef')
                                                            ),
                                                            objectProperty(
                                                                identifier('value'),
                                                                callExpression(
                                                                    identifier('__getdeflocation__'),
                                                                    [identifier('f')]
                                                                )
                                                            )
                                                        ]
                                                    )

                                                ]

                                            )
                                        ),
                                        returnStatement(
                                            callExpression(
                                                memberExpression(
                                                    identifier('f'),
                                                    identifier('apply')
                                                ),
                                                [
                                                    identifier('e'),
                                                    parseExpression('Array.prototype.slice.call(arguments, 1)')
                                                ]
                                            )
                                        )
                                    ]

                                )
                            )
                        ),
                        [o].concat(path.node.arguments as any)
                    );
                    newCallExpr.start = path.node.start;
                    newCallExpr.end = path.node.end;
                    newCallExpr.loc = {
                        start: {
                            index: path.node.loc!.start.index,
                            line: path.node.loc!.start.line,
                            column: path.node.loc!.start.column
                        },
                        end: {
                            index: path.node.loc!.end.index,
                            line: path.node.loc!.end.line,
                            column: path.node.loc!.end.column
                        }
                    };
                    path.replaceWith(newCallExpr);
                    path.skip();
                }

                else {
                    newCallExpr = callExpression(
                        parenthesizedExpression(
                            functionExpression(
                                null,
                                [identifier('x')],
                                blockStatement(
                                    [
                                        expressionStatement(
                                            callExpression(
                                                identifier('__record__'),
                                                [
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('line'),
                                                                numericLiteral(path.get('callee').node.loc!.start.line),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('column'),
                                                                numericLiteral(path.get('callee').node.loc!.start.column),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('index'),
                                                                numericLiteral(path.get('callee').node.start!),
                                                                false
                                                            ),
                                                        ]
                                                    ),
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('line'),
                                                                numericLiteral(path.get('callee').node.loc!.end.line),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('column'),
                                                                numericLiteral(path.get('callee').node.loc!.end.column),
                                                                false
                                                            ),
                                                            objectProperty(
                                                                identifier('index'),
                                                                numericLiteral(path.get('callee').node.end!),
                                                                false
                                                            ),
                                                        ]
                                                    ),
                                                    typeof filename === 'string' ? stringLiteral(filename) : identifier('undefined'),
                                                    objectExpression(
                                                        [
                                                            objectProperty(
                                                                identifier('type'),
                                                                stringLiteral('funcDef')
                                                            ),
                                                            objectProperty(
                                                                identifier('value'),
                                                                callExpression(
                                                                    identifier('__getdeflocation__'),
                                                                    [identifier('x')]
                                                                )
                                                            )
                                                        ]
                                                    )

                                                ]

                                            )
                                        ),
                                        returnStatement(identifier('x'))
                                    ]
                                )
                            )
                        ),
                        [(path.get('callee') as NodePath<Expression>).node]
                    );
                    newCallExpr.start = path.get('callee').node.start;
                    newCallExpr.end = path.get('callee').node.end;
                    newCallExpr.loc = {
                        start: {
                            index: path.get('callee').node.loc!.start.index,
                            line: path.get('callee').node.loc!.start.line,
                            column: path.get('callee').node.loc!.start.column
                        },
                        end: {
                            index: path.get('callee').node.loc!.end.index,
                            line: path.get('callee').node.loc!.end.line,
                            column: path.get('callee').node.loc!.end.column
                        }
                    };
                    path.get('callee').replaceWith(newCallExpr);
                    path.skip();
                }
            }

            else if (path.isFunctionDeclaration()) {
                let objectDefinePropertyExpr = callExpression(
                    memberExpression(
                        identifier('Object'),
                        identifier('defineProperty')
                    ),
                    [
                        path.node.id as Identifier,
                        stringLiteral('__deflocation__'),
                        objectExpression(
                            [
                                objectProperty(
                                    identifier('enumerable'),
                                    booleanLiteral(false)
                                ),
                                objectProperty(
                                    identifier('configurable'),
                                    booleanLiteral(false)
                                ),
                                objectProperty(
                                    identifier('value'),
                                    objectExpression(
                                        [
                                            objectProperty(
                                                identifier('start'),
                                                objectExpression(
                                                    [
                                                        objectProperty(
                                                            identifier('line'),
                                                            numericLiteral(path.node.loc!.start.line),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('column'),
                                                            numericLiteral(path.node.loc!.start.column),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('index'),
                                                            numericLiteral(path.node.start!),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                false
                                            ),
                                            objectProperty(
                                                identifier('end'),
                                                objectExpression(
                                                    [
                                                        objectProperty(
                                                            identifier('line'),
                                                            numericLiteral(path.node.loc!.end.line),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('column'),
                                                            numericLiteral(path.node.loc!.end.column),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('index'),
                                                            numericLiteral(path.node.end!),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                false
                                            ),
                                            objectProperty(
                                                identifier('filename'),
                                                typeof filename == 'string' ? stringLiteral(filename) : identifier('undefined')
                                            )
                                        ]
                                    )
                                )
                            ]
                        )

                    ]
                );
                path.insertAfter(
                    expressionStatement(objectDefinePropertyExpr)
                );
                path.getNextSibling().skip();
            }
            /* Instrumentation of function expression with defintion locations */
            else if (path.isFunctionExpression()) {
                let newFuncExpression: any = callExpression(
                    memberExpression(
                        identifier('Object'),
                        identifier('defineProperty')
                    ),
                    [
                        path.node,
                        stringLiteral('__deflocation__'),
                        objectExpression(
                            [
                                objectProperty(
                                    identifier('enumerable'),
                                    booleanLiteral(false)
                                ),
                                objectProperty(
                                    identifier('configurable'),
                                    booleanLiteral(false)
                                ),
                                objectProperty(
                                    identifier('value'),
                                    objectExpression(
                                        [
                                            objectProperty(
                                                identifier('start'),
                                                objectExpression(
                                                    [
                                                        objectProperty(
                                                            identifier('line'),
                                                            numericLiteral(path.node.loc!.start.line),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('column'),
                                                            numericLiteral(path.node.loc!.start.column),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('index'),
                                                            numericLiteral(path.node.start!),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                false
                                            ),
                                            objectProperty(
                                                identifier('end'),
                                                objectExpression(
                                                    [
                                                        objectProperty(
                                                            identifier('line'),
                                                            numericLiteral(path.node.loc!.end.line),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('column'),
                                                            numericLiteral(path.node.loc!.end.column),
                                                            false
                                                        ),
                                                        objectProperty(
                                                            identifier('index'),
                                                            numericLiteral(path.node.end!),
                                                            false
                                                        ),
                                                    ]
                                                ),
                                                false
                                            ),
                                            objectProperty(
                                                identifier('filename'),
                                                typeof filename == 'string' ? stringLiteral(filename) : identifier('undefined')
                                            )
                                        ]
                                    )
                                )
                            ]
                        )

                    ]
                );

                newFuncExpression.start = path.node.start;
                newFuncExpression.end = path.node.end;
                newFuncExpression.loc = {
                    start: {
                        index: path.node.loc!.start.index,
                        line: path.node.loc!.start.line,
                        column: path.node.loc!.start.column
                    },
                    end: {
                        index: path.node.loc!.end.index,
                        line: path.node.loc!.end.line,
                        column: path.node.loc!.end.column
                    }
                };

                path.replaceWith(newFuncExpression);
                path.skip();
            }

            else if (path.isProgram()) {
                let funcExpr = functionExpression(
                    null,
                    [
                        identifier('module'),
                        identifier('exports'),
                        identifier('require'),
                        identifier('__filename'),
                        identifier('__dirname'),
                        identifier('__record__')
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

    return babelGenerator(ast).code;
}

function isTainted(start: number, end: number, filename: string, taintInfo: Array<TaintInfo>) {
    for (let e of taintInfo) {
        if (start === e.start.index && end === e.end.index && filename === e.filename) {
            return true;
        }
    }
    return false;
}

/**
 * Instrument the source code for tainted expressions
 * 
 * @param sourceCode source code for instrumentation
 * @param taintInfo taint information
 */
export function instrumentCodeWithTaints(sourceCode: string, filename: string, taintInfo: Array<TaintInfo>) {
    let ast = parse(sourceCode);
    babelTraverse(ast, {
        exit: function (path) {
            if (path.isExpression() && isTainted(path.node.start!, path.node.end!, filename, taintInfo)) {
                path.replaceWith(
                    callExpression(
                        functionExpression(
                            null,
                            [identifier('x')],
                            blockStatement(
                                [
                                    expressionStatement(callExpression(
                                        identifier('__record__'),
                                        [
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('line'),
                                                        numericLiteral(path.node.loc!.start.line),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('column'),
                                                        numericLiteral(path.node.loc!.start.column),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('index'),
                                                        numericLiteral(path.node.start!),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('line'),
                                                        numericLiteral(path.node.loc!.end.line),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('column'),
                                                        numericLiteral(path.node.loc!.end.column),
                                                        false
                                                    ),
                                                    objectProperty(
                                                        identifier('index'),
                                                        numericLiteral(path.node.end!),
                                                        false
                                                    ),
                                                ]
                                            ),
                                            typeof filename === 'string' ? stringLiteral(filename) : identifier('undefined'),
                                            objectExpression(
                                                [
                                                    objectProperty(
                                                        identifier('type'),
                                                        stringLiteral('taintValue')
                                                    ),
                                                    objectProperty(
                                                        identifier('value'),
                                                        identifier('x')
                                                    )
                                                ]
                                            )

                                        ]
                                    )),
                                    returnStatement(identifier('x'))
                                ]
                            )
                        ),
                        [path.node]
                    )
                )
                path.skip();
            }
        }
    })
}
