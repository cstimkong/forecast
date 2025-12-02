"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const arrUnion_1 = tslib_1.__importDefault(require("./arrUnion"));
const cloneDeep_1 = tslib_1.__importDefault(require("./cloneDeep"));
const isObject_1 = require("./isObject");
const merge = (target, obj) => {
    Object.keys(obj).forEach((key) => {
        const oldVal = obj[key];
        const newVal = target[key];
        if (isObject_1.isObject(newVal) && isObject_1.isObject(oldVal)) {
            target[key] = merge(newVal, oldVal);
        }
        else if (Array.isArray(newVal)) {
            target[key] = arrUnion_1.default([], newVal, oldVal);
        }
        else {
            target[key] = cloneDeep_1.default(oldVal);
        }
    });
    return target;
};
const mergeDeep = (orig, ...rest) => {
    const source = !isObject_1.isObject(orig) && !Array.isArray(orig) ? {} : Object.assign({}, orig);
    const target = cloneDeep_1.default(source);
    rest.forEach((val) => {
        if (isObject_1.isObject(val) || Array.isArray(val)) {
            merge(target, val);
        }
    });
    return target;
};
exports.default = mergeDeep;

//# sourceMappingURL=mergeDeep.js.map
