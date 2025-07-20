import { AllType } from '../interfaces';
export declare function isNil(value: AllType): boolean;
export declare function isNull(value: AllType): boolean;
export declare function isUndefined(value: AllType): boolean;
export declare function getObjectWithoutEmptyPropsFrom(object: object): object;
export declare function getObjectWithoutUndefinedPropsFrom(object: object): object;
export declare function upsertObjectToArray(arr: AllType[], prop: object, newVal: AllType): void;
export declare function getObjectFromArrayByProp(arr: AllType[], prop: string): AllType;
export declare function getArrayOfObjectsWithoutProp(arr: AllType[], propName: string): AllType[];
