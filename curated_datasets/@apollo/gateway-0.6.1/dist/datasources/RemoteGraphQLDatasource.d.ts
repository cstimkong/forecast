import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-core';
import { ApolloError } from 'apollo-server-errors';
import { Request, Response, ValueOrPromise } from 'apollo-server-env';
import { GraphQLDataSource } from './types';
export declare class RemoteGraphQLDataSource implements GraphQLDataSource {
    constructor(config?: Partial<RemoteGraphQLDataSource> & object & ThisType<RemoteGraphQLDataSource>);
    url: string;
    process<TContext>({ request, context, }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>): Promise<GraphQLResponse>;
    protected willSendRequest?<TContext>(requestContext: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>): ValueOrPromise<void>;
    protected didReceiveResponse<TResult = any>(response: Response, _request: Request): Promise<TResult>;
    protected didEncounterError(error: Error, _request: Request): void;
    protected parseBody(response: Response): Promise<object | string>;
    protected errorFromResponse(response: Response): Promise<ApolloError>;
}
//# sourceMappingURL=RemoteGraphQLDatasource.d.ts.map