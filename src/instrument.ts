/**
 *  This file is part of FesaJS.
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

const mockPrototypeTemplate = babelTemplate.expression('Object.setPrototypeOf(%%objexpr%%, %%proto%%)');

const mockTypeofTemplate = babelTemplate.expression('typeof %%varname%% === "undefined" ? "undefined" : typeof %%varname%% === "object" && %%varname%% !== null ? %%varname%%.__TYPEOF__ !== undefined ? %%varname%%.__TYPEOF__ : "object" : typeof %%varname%%');

const mockTypeofExprTemplate = babelTemplate.expression('(function(x) { return typeof x === "object" && x !== null ? x.__TYPEOF__ !== undefined ? x.__TYPEOF__ : "object" : typeof x})(%%expr%%)');

const mockClassExprTemplate = babelTemplate.expression('(function(c) { return Object.setPrototypeOf(c, __mockedObjectPrototype); })(%%classexpr%%)');

const mockComparisonTemplate = babelTemplate.expression('__mockedCompare(%%left%%, %%right%%, %%cmpop%%)');

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

            else if (path.isObjectExpression()) {
                path.replaceWith(mockPrototypeTemplate({objexpr: path.node, proto: identifier('__mockedObjectPrototype')}));
                path.skip();
            }
            
            else if (path.isFunctionExpression()) {
                path.replaceWith(mockPrototypeTemplate({objexpr: path.node, proto: identifier('__mockedFunctionPrototype')}));
                path.skip();
            }

            else if (path.isFunctionDeclaration()) {
                let inserted = path.insertAfter([
                    expressionStatement(mockPrototypeTemplate({objexpr: path.node.id, proto: identifier('__mockedFunctionPrototype')})),
                    expressionStatement(mockPrototypeTemplate({objexpr: memberExpression(path.node.id as Identifier, identifier('prototype')), proto: identifier('__mockedObjectPrototype')}))
                ]);
                inserted.forEach(x => x.skip());
            }

            else if (path.isClassDeclaration() && !path.get('superClass').node) {
                let inserted = path.insertAfter(expressionStatement(mockPrototypeTemplate({objexpr: memberExpression(path.get('id').node as Identifier, identifier('prototype'), false), proto: identifier('__mockedObjectPrototype')})));
                inserted.forEach(x => x.skip());
            }

            else if (path.isClassExpression() && !path.get('superClass').node) {
                path.replaceWith(mockClassExprTemplate({classexpr: path.node}));
                path.skip();
            }

            else if (path.isNewExpression()) {
                let callee = path.get('callee').node;
                if (callee.type === 'Identifier' && callee.name === 'Object') {
                    path.replaceWith(mockPrototypeTemplate({objexpr: path.node, proto: identifier('__mockedObjectPrototype')}));
                    path.skip();
                }
                if (callee.type === 'Identifier' && callee.name === 'Function') {
                    path.replaceWith(mockPrototypeTemplate({objexpr: path.node, proto: identifier('__mockedFunctionPrototype')}));
                    path.skip();
                }

                if (callee.type === 'Identifier' && callee.name === 'Array') {
                    path.replaceWith(mockPrototypeTemplate({objexpr: path.node, proto: identifier('__mockedArrayPrototype')}));
                    path.skip();
                }
            }

            else if (path.isArrayExpression()) {
                path.replaceWith(mockPrototypeTemplate({objexpr: path.node, proto: identifier('__mockedArrayPrototype')}));
                path.skip();
            }

            else if (path.isBinaryExpression() ) {
                if (path.node.operator === '===' || path.node.operator === '!==' || path.node.operator === '==' || path.node.operator === '!=') {
                    path.replaceWith(mockComparisonTemplate({left: path.get('left').node, right: path.get('right').node, cmpop: stringLiteral(path.node.operator)}));
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

