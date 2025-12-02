import { DocumentNode, FieldNode, GraphQLAbstractType, GraphQLCompositeType, GraphQLField, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';
import { FieldSet } from './FieldSet';
import { QueryPlan, VariableUsage, OperationContext, FragmentMap } from './QueryPlan';
export declare function buildQueryPlan(operationContext: OperationContext): QueryPlan;
export declare function collectSubfields(context: QueryPlanningContext, returnType: GraphQLCompositeType, fields: FieldSet): FieldSet;
export declare function buildOperationContext(schema: GraphQLSchema, document: DocumentNode, operationName?: string): OperationContext;
export declare function buildQueryPlanningContext({ operation, schema, fragments, }: OperationContext): QueryPlanningContext;
export declare class QueryPlanningContext {
    readonly schema: GraphQLSchema;
    readonly operation: OperationDefinitionNode;
    readonly fragments: FragmentMap;
    constructor(schema: GraphQLSchema, operation: OperationDefinitionNode, fragments: FragmentMap);
    getFieldDef(parentType: GraphQLCompositeType, fieldNode: FieldNode): GraphQLField<any, any, {
        [key: string]: any;
    }>;
    getPossibleTypes(type: GraphQLAbstractType | GraphQLObjectType): ReadonlyArray<GraphQLObjectType>;
    getVariableUsages(selectionSet: SelectionSetNode): VariableUsage[];
    getBaseService(parentType: GraphQLObjectType): string | null;
    getOwningService(parentType: GraphQLObjectType, fieldDef: GraphQLField<any, any>): string | null;
    getKeyFields(parentType: GraphQLCompositeType, serviceName: string): FieldSet;
    getRequiredFields(parentType: GraphQLCompositeType, fieldDef: GraphQLField<any, any>, serviceName: string): FieldSet;
    getProvidedFields(fieldDef: GraphQLField<any, any>, serviceName: string): FieldSet;
}
//# sourceMappingURL=buildQueryPlan.d.ts.map