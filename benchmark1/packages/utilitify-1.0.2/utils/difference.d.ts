/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export declare function difference<T>(object: T, base?: T | any[] | object): T | T[] | Record<string, any>;
export declare function isDifference(object: any, base?: any): boolean;
