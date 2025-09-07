import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-core';
import { GraphQLSchema, DocumentNode } from 'graphql';
import { GraphQLDataSource } from './types';
export declare class LocalGraphQLDataSource implements GraphQLDataSource {
    readonly schema: GraphQLSchema;
    constructor(schema: GraphQLSchema);
    process<TContext>({ request, }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>): Promise<GraphQLResponse>;
    sdl(): DocumentNode;
}
//# sourceMappingURL=LocalGraphQLDatasource.d.ts.map