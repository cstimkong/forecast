"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_topath_1 = tslib_1.__importDefault(require("lodash.topath"));
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const lodash_set_1 = tslib_1.__importDefault(require("lodash.set"));
exports.delIn = (obj, path) => {
    const pathArr = lodash_topath_1.default(path);
    if (pathArr.length === 1) {
        if (Array.isArray(obj)) {
            const newEntity = [...obj];
            newEntity.splice(parseInt(pathArr[0], 2), 1);
            return newEntity;
        }
        const 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _a = pathArr[0], 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toDelete = obj[_a], rest = tslib_1.__rest(obj, [typeof _a === "symbol" ? _a : _a + ""]);
        return rest;
    }
    if (pathArr.length > 1) {
        const entityPath = pathArr.slice(0, pathArr.length - 1).join('.');
        const entity = lodash_get_1.default(obj, entityPath);
        const fieldToRemove = pathArr[pathArr.length - 1];
        if (Array.isArray(entity)) {
            const newEntity = [...entity];
            newEntity.splice(parseInt(fieldToRemove, 2), 1);
            return lodash_set_1.default(obj, entityPath, newEntity);
        }
        const 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _b = fieldToRemove, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toDelete = entity[_b], newEntity = tslib_1.__rest(entity, [typeof _b === "symbol" ? _b : _b + ""]);
        return lodash_set_1.default(obj, entityPath, newEntity);
    }
    return obj;
};

//# sourceMappingURL=delIn.js.map
