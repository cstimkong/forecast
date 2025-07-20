"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_transform_1 = tslib_1.__importDefault(require("lodash.transform"));
const isObject_1 = require("./isObject");
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base = {}) {
    if (Array.isArray(object)) {
        return object.filter(x => !base.includes(x));
    }
    const mergedObject = Object.assign({}, base, object);
    function changes(subObject, subBase, subMergedObject) {
        return lodash_transform_1.default(subMergedObject, (result, _value, key) => {
            const value = subObject[key];
            if (!Object.prototype.hasOwnProperty.call(subBase, key)) {
                result[key] = value;
                // eslint-disable-next-line eqeqeq
            }
            else if (value != subBase[key]) {
                const newValue = (isObject_1.isObject(value) && isObject_1.isObject(subBase[key]))
                    ? changes(value, subBase[key], Object.assign({}, subBase[key], value)) : value;
                result[key] = newValue;
            }
        });
    }
    return changes(object, base, mergedObject);
}
exports.difference = difference;
function isDifference(object, base = {}) {
    return Array.isArray(object)
        ? (difference(object, base)).length > 0
        : Object.keys(difference(object, base)).length > 0;
}
exports.isDifference = isDifference;

//# sourceMappingURL=difference.js.map
