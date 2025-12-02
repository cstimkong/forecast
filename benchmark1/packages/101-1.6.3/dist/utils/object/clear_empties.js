"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearEmpties = void 0;
exports.clearEmpties = (object) => {
    Object.keys(object).forEach((key) => {
        if (typeof object[key] !== "object") {
            return;
        }
        exports.clearEmpties(object[key]);
        if (Object.keys(object[key]).length === 0) {
            delete object[key];
        }
    });
    return object;
};
//# sourceMappingURL=clear_empties.js.map