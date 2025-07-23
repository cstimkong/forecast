"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const node_fetch_1 = __importDefault(require("node-fetch"));
let serviceDefinitionMap = new Map();
function getServiceDefinitionsFromRemoteEndpoint({ serviceList, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!serviceList || !serviceList.length) {
            throw new Error('Tried to load services from remote endpoints but none provided');
        }
        let isNew = false;
        const services = (yield Promise.all(serviceList.map(service => {
            if (!service.url) {
                throw new Error(`Tried to load schema from ${service.name} but no url found`);
            }
            return node_fetch_1.default(service.url, {
                method: 'POST',
                body: JSON.stringify({
                    query: 'query GetServiceDefinition { _service { sdl } }',
                }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then(res => res.json())
                .then(({ data, errors }) => {
                if (data && !errors) {
                    const typeDefs = data._service.sdl;
                    const previousDefinition = serviceDefinitionMap.get(service.name);
                    if (previousDefinition !== typeDefs) {
                        isNew = true;
                    }
                    serviceDefinitionMap.set(service.name, typeDefs);
                    return Object.assign({}, service, { typeDefs: graphql_1.parse(typeDefs) });
                }
                if (errors) {
                    errors.forEach(console.error);
                }
                return false;
            })
                .catch(error => {
                console.warn(`Encountered error when loading ${service.name} at ${service.url}: ${error.message}`);
                return false;
            });
        })).then(services => services.filter(Boolean)));
        return [services, isNew];
    });
}
exports.getServiceDefinitionsFromRemoteEndpoint = getServiceDefinitionsFromRemoteEndpoint;
//# sourceMappingURL=loadServicesFromRemoteEndpoint.js.map