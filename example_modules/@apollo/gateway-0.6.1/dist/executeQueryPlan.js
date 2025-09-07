"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const deepMerge_1 = require("./utilities/deepMerge");
const graphql_2 = require("./utilities/graphql");
function executeQueryPlan(queryPlan, serviceMap, requestContext, operationContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        const context = {
            queryPlan,
            operationContext,
            serviceMap,
            requestContext,
            errors,
        };
        let data = Object.create(null);
        if (queryPlan.node) {
            yield executeNode(context, queryPlan.node, data, []);
        }
        try {
            ({ data } = yield graphql_1.execute({
                schema: operationContext.schema,
                document: {
                    kind: graphql_1.Kind.DOCUMENT,
                    definitions: [
                        operationContext.operation,
                        ...Object.values(operationContext.fragments),
                    ],
                },
                rootValue: data,
                variableValues: requestContext.request.variables,
                fieldResolver: exports.defaultFieldResolverWithAliasSupport,
            }));
        }
        catch (error) {
            return { errors: [error] };
        }
        return errors.length === 0 ? { data } : { errors, data };
    });
}
exports.executeQueryPlan = executeQueryPlan;
function executeNode(context, node, results, path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!results) {
            return;
        }
        try {
            switch (node.kind) {
                case 'Sequence':
                    for (const childNode of node.nodes) {
                        yield executeNode(context, childNode, results, path);
                    }
                    break;
                case 'Parallel':
                    yield Promise.all(node.nodes.map((childNode) => __awaiter(this, void 0, void 0, function* () { return executeNode(context, childNode, results, path); })));
                    break;
                case 'Flatten':
                    yield executeNode(context, node.node, flattenResultsAtPath(results, node.path), [...path, ...node.path]);
                    break;
                case 'Fetch':
                    yield executeFetch(context, node, results, path);
                    break;
            }
        }
        catch (error) {
            context.errors.push(error);
        }
    });
}
function executeFetch(context, fetch, results, _path) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = context.serviceMap[fetch.serviceName];
        if (!service) {
            throw new Error(`Couldn't find service with name "${fetch.serviceName}"`);
        }
        const operationType = context.operationContext.operation.operation;
        const entities = Array.isArray(results) ? results : [results];
        if (entities.length < 1)
            return;
        if (!fetch.requires) {
            let variables = Object.create(null);
            if (fetch.variableUsages) {
                for (const { node, defaultValue } of fetch.variableUsages) {
                    const name = node.name.value;
                    const providedVariables = context.requestContext.request.variables;
                    if (providedVariables && providedVariables[name] !== 'undefined') {
                        variables[name] = providedVariables[name];
                    }
                    else if (defaultValue) {
                        variables[name] = defaultValue;
                    }
                }
            }
            const dataReceivedFromService = yield sendOperation(context, operationForRootFetch(fetch, operationType), variables);
            for (const entity of entities) {
                deepMerge_1.deepMerge(entity, dataReceivedFromService);
            }
        }
        else {
            const requires = fetch.requires;
            const representations = [];
            const representationToEntity = [];
            entities.forEach((entity, index) => {
                const representation = executeSelectionSet(entity, requires);
                if (representation && representation[graphql_1.TypeNameMetaFieldDef.name]) {
                    representations.push(representation);
                    representationToEntity.push(index);
                }
            });
            const dataReceivedFromService = yield sendOperation(context, operationForEntitiesFetch(fetch), { representations });
            if (!dataReceivedFromService) {
                return;
            }
            if (!(dataReceivedFromService._entities &&
                Array.isArray(dataReceivedFromService._entities))) {
                throw new Error(`Expected "data._entities" in response to be an array`);
            }
            const receivedEntities = dataReceivedFromService._entities;
            if (receivedEntities.length !== representations.length) {
                throw new Error(`Expected "data._entities" to contain ${representations.length} elements`);
            }
            for (let i = 0; i < entities.length; i++) {
                deepMerge_1.deepMerge(entities[representationToEntity[i]], receivedEntities[i]);
            }
        }
        function sendOperation(context, operation, variables) {
            return __awaiter(this, void 0, void 0, function* () {
                const source = graphql_1.print(operation);
                const response = yield service.process({
                    request: {
                        query: source,
                        variables,
                    },
                    context: context.requestContext.context,
                });
                if (response.errors) {
                    context.errors.push(downstreamServiceError(undefined, fetch.serviceName, source, variables, response.errors));
                }
                return response.data;
            });
        }
    });
}
function executeSelectionSet(source, selectionSet) {
    const result = Object.create(null);
    for (const selection of selectionSet.selections) {
        switch (selection.kind) {
            case graphql_1.Kind.FIELD:
                const responseName = graphql_2.getResponseName(selection);
                if (!source[responseName]) {
                    throw new Error(`Field "${responseName}" was not found in response.`);
                }
                if (selection.selectionSet) {
                    result[responseName] = executeSelectionSet(source[responseName], selection.selectionSet);
                }
                else {
                    result[responseName] = source[responseName];
                }
                break;
            case graphql_1.Kind.INLINE_FRAGMENT:
                if (!selection.typeCondition)
                    continue;
                const typename = source && source['__typename'];
                if (!typename)
                    continue;
                if (typename === selection.typeCondition.name.value) {
                    deepMerge_1.deepMerge(result, executeSelectionSet(source, selection.selectionSet));
                }
                break;
        }
    }
    return result;
}
function flattenResultsAtPath(value, path) {
    if (path.length === 0)
        return value;
    if (value === undefined || value === null)
        return value;
    const [current, ...rest] = path;
    if (current === '@') {
        return value.flatMap((element) => flattenResultsAtPath(element, rest));
    }
    else {
        return flattenResultsAtPath(value[current], rest);
    }
}
function downstreamServiceError(message, serviceName, query, variables, downstreamErrors, nodes, path) {
    if (!message) {
        message = `Error while fetching subquery from service "${serviceName}"`;
    }
    const extensions = {
        code: 'DOWNSTREAM_SERVICE_ERROR',
        serviceName,
        query,
        variables,
        downstreamErrors,
    };
    return new graphql_1.GraphQLError(message, nodes, undefined, undefined, path, undefined, extensions);
}
function mapFetchNodeToVariableDefinitions(node) {
    const variableUsage = node.variableUsages;
    return variableUsage
        ? variableUsage.map(({ node, type }) => ({
            kind: graphql_1.Kind.VARIABLE_DEFINITION,
            variable: node,
            type: graphql_2.astFromType(type),
        }))
        : [];
}
function operationForRootFetch(fetch, operation = 'query') {
    return {
        kind: graphql_1.Kind.OPERATION_DEFINITION,
        operation,
        selectionSet: fetch.selectionSet,
        variableDefinitions: mapFetchNodeToVariableDefinitions(fetch),
    };
}
function operationForEntitiesFetch(fetch) {
    const representationsVariable = {
        kind: graphql_1.Kind.VARIABLE,
        name: { kind: graphql_1.Kind.NAME, value: 'representations' },
    };
    return {
        kind: graphql_1.Kind.OPERATION_DEFINITION,
        operation: 'query',
        variableDefinitions: [
            {
                kind: graphql_1.Kind.VARIABLE_DEFINITION,
                variable: representationsVariable,
                type: {
                    kind: graphql_1.Kind.NON_NULL_TYPE,
                    type: {
                        kind: graphql_1.Kind.LIST_TYPE,
                        type: {
                            kind: graphql_1.Kind.NON_NULL_TYPE,
                            type: {
                                kind: graphql_1.Kind.NAMED_TYPE,
                                name: { kind: graphql_1.Kind.NAME, value: '_Any' },
                            },
                        },
                    },
                },
            },
        ].concat(mapFetchNodeToVariableDefinitions(fetch)),
        selectionSet: {
            kind: graphql_1.Kind.SELECTION_SET,
            selections: [
                {
                    kind: graphql_1.Kind.FIELD,
                    name: { kind: graphql_1.Kind.NAME, value: '_entities' },
                    arguments: [
                        {
                            kind: graphql_1.Kind.ARGUMENT,
                            name: {
                                kind: graphql_1.Kind.NAME,
                                value: representationsVariable.name.value,
                            },
                            value: representationsVariable,
                        },
                    ],
                    selectionSet: fetch.selectionSet,
                },
            ],
        },
    };
}
exports.defaultFieldResolverWithAliasSupport = function (source, args, contextValue, info) {
    if (typeof source === 'object' || typeof source === 'function') {
        const property = source[info.path.key];
        if (typeof property === 'function') {
            return source[info.fieldName](args, contextValue, info);
        }
        return property;
    }
};
//# sourceMappingURL=executeQueryPlan.js.map