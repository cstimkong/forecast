"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_caching_1 = require("apollo-server-caching");
const graphql_1 = require("graphql");
const apollo_graphql_1 = require("apollo-graphql");
const federation_1 = require("@apollo/federation");
const loglevel_1 = __importDefault(require("loglevel"));
const loglevel_debug_1 = __importDefault(require("loglevel-debug"));
const buildQueryPlan_1 = require("./buildQueryPlan");
exports.buildQueryPlan = buildQueryPlan_1.buildQueryPlan;
exports.buildOperationContext = buildQueryPlan_1.buildOperationContext;
const executeQueryPlan_1 = require("./executeQueryPlan");
exports.executeQueryPlan = executeQueryPlan_1.executeQueryPlan;
const loadServicesFromRemoteEndpoint_1 = require("./loadServicesFromRemoteEndpoint");
const QueryPlan_1 = require("./QueryPlan");
exports.serializeQueryPlan = QueryPlan_1.serializeQueryPlan;
const RemoteGraphQLDatasource_1 = require("./datasources/RemoteGraphQLDatasource");
function isLocalConfig(config) {
    return 'localServiceList' in config;
}
class ApolloGateway {
    constructor(config) {
        this.isReady = false;
        this.serviceMap = Object.create(null);
        this.executor = (requestContext) => __awaiter(this, void 0, void 0, function* () {
            const { request, document, queryHash } = requestContext;
            const operationContext = buildQueryPlan_1.buildOperationContext(this.schema, document, request.operationName);
            let queryPlan;
            if (this.queryPlanStore) {
                queryPlan = yield this.queryPlanStore.get(queryHash);
            }
            if (!queryPlan) {
                queryPlan = buildQueryPlan_1.buildQueryPlan(operationContext);
                if (this.queryPlanStore) {
                    Promise.resolve(this.queryPlanStore.set(queryHash, queryPlan)).catch(err => this.logger.warn('Could not store queryPlan', err));
                }
            }
            const response = yield executeQueryPlan_1.executeQueryPlan(queryPlan, this.serviceMap, requestContext, operationContext);
            const shouldShowQueryPlan = this.config.__exposeQueryPlanExperimental &&
                request.http &&
                request.http.headers &&
                request.http.headers.get('Apollo-Query-Plan-Experimental');
            if (shouldShowQueryPlan) {
                const serializedQueryPlan = QueryPlan_1.serializeQueryPlan(queryPlan);
                this.logger.debug(serializedQueryPlan);
                response.extensions = { __queryPlanExperimental: serializedQueryPlan };
            }
            return response;
        });
        this.config = Object.assign({ __exposeQueryPlanExperimental: process.env.NODE_ENV !== 'production' }, config);
        this.logger = loglevel_1.default.getLogger(`apollo-gateway:`);
        loglevel_debug_1.default(this.logger);
        if (config.debug === true) {
            this.logger.enableAll();
        }
        if (isLocalConfig(config)) {
            this.createSchema(config.localServiceList);
        }
        this.initializeQueryPlanStore();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady) {
                this.logger.debug('Loading configuration for Gateway');
                const [services] = yield this.loadServiceDefinitions(this.config);
                this.logger.debug('Configuration loaded for Gateway');
                this.createSchema(services);
            }
            return { schema: this.schema, executor: this.executor };
        });
    }
    createSchema(services) {
        this.logger.debug(`Composing schema from service list: \n${services
            .map(({ name }) => `  ${name}`)
            .join('\n')}`);
        let { schema, errors } = federation_1.composeAndValidate(services);
        if (errors && errors.length > 0) {
            throw new apollo_graphql_1.GraphQLSchemaValidationError(errors);
        }
        this.schema = wrapSchemaWithAliasResolver(schema);
        this.createServices(services);
        this.logger.debug('Schema loaded and ready for execution');
        this.isReady = true;
    }
    createServices(services) {
        for (const serviceDef of services) {
            if (!serviceDef.url && !isLocalConfig(this.config)) {
                throw new Error(`Service defintion for service ${serviceDef.name} is missing a url`);
            }
            this.serviceMap[serviceDef.name] = this.config.buildService
                ? this.config.buildService(serviceDef)
                : new RemoteGraphQLDatasource_1.RemoteGraphQLDataSource({
                    url: serviceDef.url,
                });
        }
    }
    loadServiceDefinitions(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isLocalConfig(config))
                return [config.localServiceList, false];
            if (!config.serviceList)
                throw new Error('The gateway requires a service list to be provided in the config');
            const [remoteServices, isNewService,] = yield loadServicesFromRemoteEndpoint_1.getServiceDefinitionsFromRemoteEndpoint({
                serviceList: config.serviceList,
            });
            this.createServices(remoteServices);
            return [remoteServices, isNewService];
        });
    }
    initializeQueryPlanStore() {
        this.queryPlanStore = new apollo_server_caching_1.InMemoryLRUCache({
            maxSize: Math.pow(2, 20) * 30,
            sizeCalculator: approximateObjectSize,
        });
    }
}
exports.ApolloGateway = ApolloGateway;
function approximateObjectSize(obj) {
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}
function wrapSchemaWithAliasResolver(schema) {
    const typeMap = schema.getTypeMap();
    Object.keys(typeMap).forEach(typeName => {
        const type = typeMap[typeName];
        if (graphql_1.isObjectType(type) && !graphql_1.isIntrospectionType(type)) {
            const fields = type.getFields();
            Object.keys(fields).forEach(fieldName => {
                const field = fields[fieldName];
                field.resolve = executeQueryPlan_1.defaultFieldResolverWithAliasSupport;
            });
        }
    });
    return schema;
}
__export(require("./datasources"));
//# sourceMappingURL=index.js.map