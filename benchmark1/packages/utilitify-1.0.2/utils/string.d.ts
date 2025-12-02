import { Maybe, IJson } from '../interfaces';
export declare function getTruncatedString(str: string, length: number, punctuationMark?: Maybe<string>): string;
export declare function isJsonString(str: string): boolean;
export declare function getJsonFromString(str: string): IJson;
export declare function toPascalCase(string: string): string;
