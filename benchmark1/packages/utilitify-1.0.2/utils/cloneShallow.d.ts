import { TypedArray } from '../interfaces';
export declare const cloneRegExp: (val: RegExp) => RegExp;
export declare const cloneArrayBuffer: (val: ArrayBuffer) => ArrayBuffer;
export declare const cloneTypedArray: (val: TypedArray) => TypedArray;
export declare const cloneSymbol: (val: symbol) => symbol;
declare const cloneShallow: (val: any) => any;
export default cloneShallow;
