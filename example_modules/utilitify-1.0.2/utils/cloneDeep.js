"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kind_of_1 = tslib_1.__importDefault(require("kind-of"));
const isObject_1 = require("./isObject");
const cloneShallow_1 = tslib_1.__importDefault(require("./cloneShallow"));
const cloneDeep = (val, instanceClone) => {
    switch (kind_of_1.default(val)) {
        case 'object':
            return exports.cloneObjectDeep(val, instanceClone); // eslint-disable-line
        case 'array':
            return exports.cloneArrayDeep(val, instanceClone); // eslint-disable-line
        default:
            return cloneShallow_1.default(val);
    }
};
exports.cloneObjectDeep = (obj, instanceClone) => {
    if (isObject_1.isObject(obj)) {
        const res = Object.entries(obj).reduce((current, [key, value]) => {
            const clonedValue = cloneDeep(value, instanceClone);
            return Object.assign({}, current, { [key]: clonedValue });
        }, {});
        return res;
    }
    if (instanceClone !== undefined) {
        return instanceClone(obj);
    }
    return obj;
};
exports.cloneArrayDeep = (arr, instanceClone) => {
    const res = arr.map((item) => cloneDeep(item, instanceClone));
    return res;
};
exports.default = cloneDeep;

//# sourceMappingURL=cloneDeep.js.map
