"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compose = (...funcs) => {
    const len = funcs.length;
    if (funcs.some((func) => typeof func !== 'function')) {
        throw new TypeError('Expected a function');
    }
    return (...args) => {
        let index = 1;
        let result = len ? funcs[index - 1].apply(this, args) : args[0];
        while (index < len) {
            result = funcs[index].call(this, result);
            index += 1;
        }
        return result;
    };
};
exports.default = compose;

//# sourceMappingURL=compose.js.map
