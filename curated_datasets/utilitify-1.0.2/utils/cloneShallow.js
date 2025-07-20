"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kind_of_1 = tslib_1.__importDefault(require("kind-of"));
exports.cloneRegExp = (val) => {
    const RegExpConstructor = val.constructor;
    const re = new RegExpConstructor(val.source, val.flags);
    re.lastIndex = val.lastIndex;
    return re;
};
exports.cloneArrayBuffer = (val) => {
    const ArrayBufferConstructor = val.constructor;
    const res = new ArrayBufferConstructor(val.byteLength);
    new Uint8Array(res).set(new Uint8Array(val));
    return res;
};
exports.cloneTypedArray = (val) => {
    const TypedArrayConstructor = val.constructor;
    const result = new TypedArrayConstructor(val.buffer, val.byteOffset, val.length);
    return result;
};
exports.cloneSymbol = (val) => Object(Symbol.prototype.valueOf.call(val));
const cloneShallow = (val) => {
    switch (kind_of_1.default(val)) {
        case 'array':
            return val.slice();
        case 'object':
            return Object.assign({}, val);
        case 'date':
            return new val.constructor(Number(val));
        case 'map':
            return new Map(val);
        case 'set':
            return new Set(val);
        case 'symbol':
            return exports.cloneSymbol(val);
        case 'arraybuffer':
            return exports.cloneArrayBuffer(val);
        case 'float32array':
        case 'float64array':
        case 'int16array':
        case 'int32array':
        case 'int8array':
        case 'uint16array':
        case 'uint32array':
        case 'uint8clampedarray':
        case 'uint8array':
            return exports.cloneTypedArray(val);
        case 'regexp':
            return exports.cloneRegExp(val);
        case 'error':
            return Object.create(val);
        default: {
            return val;
        }
    }
};
exports.default = cloneShallow;

//# sourceMappingURL=cloneShallow.js.map
