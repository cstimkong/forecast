"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtil_1 = require("./TypeUtil");
/**
 * collide 2 arguments
 * @param arg1 first argument to collide into (note: original object won't be modified directly)
 * @param arg2 second argument to collide from
 * @param modifiers
 * @param startPath the entry path to start modifier path generation. Default value: $
 * @returns collide result
 */
function collide(arg1, arg2, modifiers, startPath = '$') {
    const arg1Clone = TypeUtil_1.isMissing(arg1) ? arg1 : JSON.parse(JSON.stringify(arg1));
    const arg2Clone = TypeUtil_1.isMissing(arg2) ? arg2 : JSON.parse(JSON.stringify(arg2));
    return collideUnsafe(arg1Clone, arg2Clone, modifiers, startPath);
}
exports.collide = collide;
/**
 * Collide unsafe (arg1 may be modified directly)
 * @param arg1 first argument to collide into (note: original object will be modified directly)
 * @param arg2 second argument to collide from
 * @param modifiers
 * @param startPath the entry path to start modifier path generation. Default value: $
 * @returns collide result
 */
function collideUnsafe(arg1, arg2, modifiers, startPath = '$') {
    if (arg2 === undefined) {
        return arg1;
    }
    if (TypeUtil_1.isMissing(arg1)) {
        return arg2;
    }
    if (TypeUtil_1.isBasicType(arg1)) {
        return collideBasic(arg1, arg2, startPath, modifiers);
    }
    if (TypeUtil_1.isArray(arg1)) {
        return collideArrays(arg1, arg2, startPath, modifiers);
    }
    return collideObjects(arg1, arg2, startPath, modifiers);
}
exports.collideUnsafe = collideUnsafe;
/**
 * collide basic value types
 * @param arg1
 * @param arg2
 * @param path
 * @param modifiers
 */
function collideBasic(arg1, arg2, path, modifiers) {
    if (modifiers && modifiers[path]) {
        return modifiers[path](arg1, arg2);
    }
    return arg2;
}
/**
 * collide objects
 * @param obj1
 * @param obj2
 * @param path
 * @param modifiers
 */
function collideObjects(obj1, obj2, path, modifiers) {
    if (!TypeUtil_1.isObject(obj2)) {
        throw new Error(`Unable to collide. Collide value at path ${path} is not an object.`);
    }
    if (modifiers && modifiers[path]) {
        return modifiers[path](obj1, obj2);
    }
    for (const key of Object.keys(obj2)) {
        const subPath = path + '.' + key;
        if (obj1[key] === undefined) {
            obj1[key] = obj2[key];
        }
        else {
            if (modifiers && modifiers[subPath]) {
                obj1[key] = modifiers[subPath](obj1[key], obj2[key]);
            }
            else {
                obj1[key] = collideUnsafe(obj1[key], obj2[key], modifiers, subPath);
            }
        }
    }
    return obj1;
}
/**
 * collide arrays. Default behaviour to push values of arr2 into arr1.
 * @param arr1
 * @param arr2
 * @param path
 * @param modifiers
 */
function collideArrays(arr1, arr2, path, modifiers) {
    if (!TypeUtil_1.isArray(arr2)) {
        throw new Error(`Unable to collide. Collide value at path ${path} is not an array.`);
    }
    if (modifiers && modifiers[path]) {
        return modifiers[path](arr1, arr2);
    }
    else {
        for (const item of arr2) {
            if (arr1.indexOf(item) < 0) {
                arr1.push(item);
            }
        }
    }
    return arr1;
}
//# sourceMappingURL=CollideUtil.js.map