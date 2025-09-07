import { GraphQLExecutor, GraphQLExecutionResult, GraphQLRequestContext } from 'apollo-server-core';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { GraphQLSchema } from 'graphql';
import { WithRequired } from 'apollo-env';
import { ServiceDefinition } from '@apollo/federation';
import { Logger } from 'loglevel';
import { buildQueryPlan, buildOperationContext } from './buildQueryPlan';
import { executeQueryPlan, ServiceMap } from './executeQueryPlan';
import { serializeQueryPlan, QueryPlan } from './QueryPlan';
import { GraphQLDataSource } from './datasources/types';
export interface GraphQLService {
    schema?: GraphQLSchema;
    executor: GraphQLExecutor;
    isReady: boolean;
}
export declare type ServiceEndpointDefinition = Pick<ServiceDefinition, 'name' | 'url'>;
export interface GatewayConfigBase {
    debug?: boolean;
    __exposeQueryPlanExperimental?: boolean;
    buildService?: (definition: ServiceEndpointDefinition) => GraphQLDataSource;
    serviceList?: ServiceEndpointDefinition[];
}
export interface LocalGatewayConfig extends GatewayConfigBase {
    localServiceList: ServiceDefinition[];
}
export declare type GatewayConfig = GatewayConfigBase | LocalGatewayConfig;
export declare class ApolloGateway implements GraphQLService {
    schema?: GraphQLSchema;
    isReady: boolean;
    protected serviceMap: ServiceMap;
    protected config: GatewayConfig;
    protected logger: Logger;
    protected queryPlanStore?: InMemoryLRUCache<QueryPlan>;
    constructor(config: GatewayConfig);
    load(): Promise<{
        schema: GraphQLSchema | undefined;
        executor: <TContext>(requestContext: WithRequired<GraphQLRequestContext<TContext>, "document" | "operation" | "queryHash">) => Promise<GraphQLExecutionResult>;
    }>;
    protected createSchema(services: ServiceDefinition[]): void;
    protected createServices(services: ServiceEndpointDefinition[]): void;
    protected loadServiceDefinitions(config: GatewayConfig): Promise<[ServiceDefinition[], boolean]>;
    executor: <TContext>(requestContext: WithRequired<GraphQLRequestContext<TContext>, "document" | "operation" | "queryHash">) => Promise<GraphQLExecutionResult>;
    private initializeQueryPlanStore;
}
export { buildQueryPlan, executeQueryPlan, serializeQueryPlan, buildOperationContext, QueryPlan, ServiceMap, };
export * from './datasources';
//# sourceMappingURL=index.d.ts.map