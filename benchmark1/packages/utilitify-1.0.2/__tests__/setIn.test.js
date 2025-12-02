"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const obj = {
    a: 1,
    b: 2,
    c: {
        d: 3,
    },
};
const obj2 = {
    a: 1,
    b: 2,
    c: {
        d: 3,
    },
    d: {
        f: {
            r: 5,
        },
    },
};
describe('This is the tests for the "setIn" util', () => {
    test('setIn: check delete prop in obj', () => {
        const result = utils_1.setIn(obj, 5, 'd.f.r');
        expect(result).toEqual(obj2);
        expect(utils_1.setIn([{ a: { b: 4 } }], 5, '0.a.b')).toEqual([{ a: { b: 5 } }]);
    });
});

//# sourceMappingURL=setIn.test.js.map
