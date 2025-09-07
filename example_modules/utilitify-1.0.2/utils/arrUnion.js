"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const union = (init, ...rest) => {
    if (!Array.isArray(init)) {
        throw new TypeError('arrUnion expects the first argument to be an array.');
    }
    const result = [...new Set([].concat(...init))];
    rest.forEach((arg) => {
        if (arg) {
            const item = Array.isArray(arg) ? arg : [arg];
            item.forEach((element) => {
                if (!result.includes(element)) {
                    result.push(element);
                }
            });
        }
    });
    return result;
};
exports.default = union;

//# sourceMappingURL=arrUnion.js.map
