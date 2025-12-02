"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASIC_TYPES = ['number', 'string', 'boolean'];
/**
 * Check if value represents a basic type (number, string or boolean)
 * @param value
 */
function isBasicType(value) {
    const type = typeof value;
    return BASIC_TYPES.indexOf(type) >= 0;
}
exports.isBasicType = isBasicType;
/**
 * Check if value is null or undefined
 * @param value
 */
function isMissing(value) {
    return value === null || value === undefined;
}
exports.isMissing = isMissing;
/**
 * Check if value is object
 * @param value
 */
function isObject(value) {
    return !isMissing(value) && typeof value === 'object' && !Array.isArray(value);
}
exports.isObject = isObject;
function isArray(value) {
    return value != null && Array.isArray(value);
}
exports.isArray = isArray;
//# sourceMappingURL=TypeUtil.js.map