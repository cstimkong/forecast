"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_findindex_1 = tslib_1.__importDefault(require("lodash.findindex"));
const lodash_omit_1 = tslib_1.__importDefault(require("lodash.omit"));
const compose_1 = tslib_1.__importDefault(require("./compose"));
function isNil(value) {
    return value == null;
}
exports.isNil = isNil;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function isUndefined(value) {
    return value === undefined;
}
exports.isUndefined = isUndefined;
function getObjectWithoutEmptyPropsFrom(object) {
    return compose_1.default((obj) => {
        const result = {};
        Object.keys(obj).forEach((key) => {
            switch (typeof obj[key]) {
                case 'string':
                    if (obj[key] !== '') {
                        result[key] = obj[key];
                    }
                    break;
                default:
                    result[key] = obj[key];
            }
        });
        return result;
    }, (obj) => {
        const result = {};
        Object.keys(obj).forEach((key) => {
            if (!isNil(obj[key])) {
                result[key] = obj[key];
            }
        });
        return result;
    })(object);
}
exports.getObjectWithoutEmptyPropsFrom = getObjectWithoutEmptyPropsFrom;
function getObjectWithoutUndefinedPropsFrom(object) {
    const result = {};
    Object.keys(object).forEach((key) => {
        if (!isUndefined(object[key])) {
            result[key] = object[key];
        }
    });
    return result;
}
exports.getObjectWithoutUndefinedPropsFrom = getObjectWithoutUndefinedPropsFrom;
function upsertObjectToArray(arr, prop, newVal) {
    const index = lodash_findindex_1.default(arr, prop);
    if (index !== -1) {
        arr.splice(index, 1, newVal);
    }
    else {
        arr.push(newVal);
    }
}
exports.upsertObjectToArray = upsertObjectToArray;
function getObjectFromArrayByProp(arr, prop) {
    const index = lodash_findindex_1.default(arr, prop);
    if (index !== -1) {
        return arr[index];
    }
    return {};
}
exports.getObjectFromArrayByProp = getObjectFromArrayByProp;
function getArrayOfObjectsWithoutProp(arr, propName) {
    return arr.map(obj => lodash_omit_1.default(obj, [propName]));
}
exports.getArrayOfObjectsWithoutProp = getArrayOfObjectsWithoutProp;

//# sourceMappingURL=utils.js.map
