/**
 *  This file is part of FesaJS.
 */

const babelTraverse = require('@babel/traverse').default;
const babelParser = require('@babel/parser');
const babelTypes = require('@babel/types');
const babelGenerator = require('@babel/generator').default;

/**
 * 
 * @param {String} source Source code string
 * @returns 
 */
function instrumentCode(source, filename) {

    let ast = babelParser.parse(source, {sourceFilename: filename});

    babelTraverse(ast, {
        exit: function(path, state) {
            if (path.isMemberExpression()) {
                if (path.get('property').isExpression()) {
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
                                        babelTypes.identifier('__record__'), [
                                            babelTypes.numericLiteral(path.get('property').node.start), 
                                            babelTypes.numericLiteral(path.get('property').node.end),
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
                    path.node.property = newFuncCallExpr;
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
                                        babelTypes.identifier('__record__'), [
                                            babelTypes.numericLiteral(path.get('right').node.start), 
                                            babelTypes.numericLiteral(path.get('right').node.end),
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
                path.get('right').replaceWith(
                    newFuncCallExpr
                );
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
                    path.replaceWith(newConditionalExpr);
                    path.skip();
                }
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

module.exports = instrumentCode;
