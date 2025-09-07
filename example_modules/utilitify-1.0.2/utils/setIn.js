"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_topath_1 = tslib_1.__importDefault(require("lodash.topath"));
const lodash_isnumber_1 = tslib_1.__importDefault(require("lodash.isnumber"));
exports.setInWithPath = (obj, value, path, pathIndex) => {
    if (pathIndex >= path.length) {
        return value;
    }
    const first = path[pathIndex];
    const next = exports.setInWithPath(obj && obj[first], value, path, pathIndex + 1);
    if (!obj) {
        const initialized = lodash_isnumber_1.default(first) ? [] : {};
        initialized[first] = next;
        return initialized;
    }
    if (Array.isArray(obj)) {
        const copy = [...obj];
        copy[first] = next;
        return copy;
    }
    const result = Object.assign({}, obj, { [first]: next });
    return result;
};
exports.setIn = (obj, value, field) => exports.setInWithPath(obj, value, lodash_topath_1.default(field), 0);

//# sourceMappingURL=setIn.js.map
