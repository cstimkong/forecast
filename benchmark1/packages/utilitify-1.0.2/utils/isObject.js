"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = (val) => val !== null
    && typeof val === 'object' && Array.isArray(val) === false;
exports.isObjectObject = (o) => exports.isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
exports.isPlainObject = (o) => {
    if (exports.isObjectObject(o) === false)
        return false;
    return true;
};

//# sourceMappingURL=isObject.js.map
