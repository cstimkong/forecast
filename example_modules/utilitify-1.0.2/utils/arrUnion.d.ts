declare type United = string | number | null | undefined | object;
declare const union: (init: United[], ...rest: United[]) => United[];
export default union;
