/**
 * 
 *  This file is part of Forecast.
 */

import babelTraverse, { NodePath } from '@babel/traverse';
import { parse, parseExpression } from '@babel/parser';
import babelTemplate from '@babel/template';
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
    Identifier,
    MemberExpression
} from '@babel/types';
import babelGenerator from '@babel/generator';
import { mockedPropertyWrite } from './helper.js';


const mockTypeofTemplate = babelTemplate.expression('typeof %%varname%% === "undefined" ? "undefined" : typeof %%varname%% === "object" && %%varname%% !== null ? %%varname%%.__TYPEOF__ !== undefined ? %%varname%%.__TYPEOF__ : "object" : typeof %%varname%%');

const mockTypeofExprTemplate = babelTemplate.expression('(function(x) { return typeof x === "object" && x !== null ? x.__TYPEOF__ !== undefined ? x.__TYPEOF__ : "object" : typeof x})(%%expr%%)');


const mockComparisonTemplate = babelTemplate.expression('__mockedCompare(%%left%%, %%right%%, %%cmpop%%)');

const mockPropertyAccessTemplate = babelTemplate.expression('__mockedPropertyAccess(%%expr%%, %%prop%%)');

const mockPropertyWriteTemplate = babelTemplate.expression('__mockedPropertyWrite(%%expr%%, %%prop%%, %%value%%, {line: %%startline%%, column: %%startcolumn%%})');

export function instrument(source: string, opts?: any) {
    opts = opts || {};
    let ast = parse(source, { sourceFilename: opts.filename });

    babelTraverse.default(ast, {
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

        exit: function (path: NodePath) {
            
            if (path.isUnaryExpression() && path.node.operator === 'typeof') {
                if (path.get('argument').isIdentifier()) {
                    path.replaceWith(mockTypeofTemplate({varname: path.get('argument').node as Identifier}))
                }
                else {
                    path.replaceWith(mockTypeofExprTemplate({expr: path.get('argument').node}));
                }
                path.skip();

            }


            else if (path.isBinaryExpression() ) {
                if (path.node.operator === '===' || path.node.operator === '!==' || path.node.operator === '==' || path.node.operator === '!=') {
                    path.replaceWith(mockComparisonTemplate({left: path.get('left').node, right: path.get('right').node, cmpop: stringLiteral(path.node.operator)}));
                    path.skip();
                }
            }

            else if (path.isMemberExpression() && path.node.computed && !(path.parentPath.isAssignmentExpression() && path.parentKey === 'left')) {
                path.replaceWith(mockPropertyAccessTemplate({expr: path.node.object, prop: path.node.property}));
                path.skip();
            }

            else if (path.isAssignmentExpression() && path.node.operator === '=' && path.node.left.type === 'MemberExpression') {
                if (path.node.left.computed) {
                    path.replaceWith(mockPropertyWriteTemplate({
                        expr: path.node.left.object,
                        prop: path.node.left.property,
                        value: path.node.right,
                        startline: numericLiteral(path.node.loc!.start.line),
                        startcolumn: numericLiteral(path.node.loc!.start.column)
                    }));
                    path.skip();
                }
                else {
                    path.replaceWith(mockPropertyWriteTemplate({
                        expr: path.node.left.object,
                        prop: stringLiteral((path.node.left.property as Identifier).name),
                        value: path.node.right,
                        startline: numericLiteral(path.node.loc!.start.line),
                        startcolumn: numericLiteral(path.node.loc!.start.column)
                    }));
                    path.skip();
                }
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
                            
           
        }
    });

    return babelGenerator.default(ast).code;
}

