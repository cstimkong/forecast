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
    c: [{ d: { f: 5 } }],
};
const arr = [{ a: 1 }, { b: 2 }];
describe('This is the tests for the "delIn" util', () => {
    test('delIn: check delete prop in obj', () => {
        expect(utils_1.delIn(obj, 'c.d')).toEqual({
            a: 1,
            b: 2,
            c: {},
        });
        expect(utils_1.delIn(obj2, 'c.0.d')).toEqual({
            a: 1,
            b: 2,
            c: [{}],
        });
        expect(utils_1.delIn({ d: 5 }, 'd')).toEqual({});
        expect(utils_1.delIn({ d: [3] }, 'd.0')).toEqual({ d: [] });
        expect(utils_1.delIn(obj2, '')).toEqual(obj2);
    });
    test('delIn: check delete prop in arr', () => {
        expect(utils_1.delIn(arr, '0')).toEqual([{ b: 2 }]);
    });
});

//# sourceMappingURL=delIn.test.js.map
