import { ServiceDefinition } from '@apollo/federation';
import { ServiceEndpointDefinition } from './';
export declare function getServiceDefinitionsFromRemoteEndpoint({ serviceList, }: {
    serviceList: ServiceEndpointDefinition[];
}): Promise<[ServiceDefinition[], boolean]>;
//# sourceMappingURL=loadServicesFromRemoteEndpoint.d.ts.map