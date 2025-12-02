declare const _default: {
    get: <T>(object: import("./types").GeneralObject<T>, key: string) => import("./types").GeneralObjectOrValue<T>;
    set: <T_1>(object: import("./types").GeneralObject<T_1>, key: string, value: any) => import("./types").GeneralObject<T_1>;
    delete: <T_2>(object: import("./types").GeneralObjectOrValue<T_2>, keys: string | number | string[] | number[]) => import("./types").GeneralObjectOrValue<T_2>;
    pick: <T_3>(object: import("./types").GeneralObject<T_3>, keys: string[]) => import("./types").GeneralObject<T_3>;
    keys: <T_4>(object: import("./types").GeneralObject<T_4>, existingKey?: string) => string[];
    entries: <T_5>(object: import("./types").GeneralObjectOrValue<T_5>, existingKey?: string) => [string, import("./types").GeneralObjectOrValue<T_5>][];
    equals: (a: any, b: any) => boolean;
    clearEmpties: <T_6>(object: import("./types").GeneralObjectOrValue<T_6>) => import("./types").GeneralObjectOrValue<T_6>;
};
export = _default;
