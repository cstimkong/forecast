"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNotNullOrUndefined(value) {
    return value !== null && typeof value !== 'undefined';
}
exports.isNotNullOrUndefined = isNotNullOrUndefined;
function isObject(value) {
    return (value !== undefined &&
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value));
}
exports.isObject = isObject;
//# sourceMappingURL=predicates.js.map