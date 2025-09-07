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
    c: {
        d: {
            f: 5,
        },
    },
    g: 5,
};
const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];
describe('This is the tests for the "difference" utils', () => {
    test('difference checking', () => {
        const testObj = Object.assign({}, obj, obj2);
        expect(utils_1.difference(testObj, obj)).toEqual(obj2);
        expect(utils_1.difference(obj, testObj)).toEqual({ c: { d: 3 } });
        expect(utils_1.difference(arr1, arr2)).toEqual([1]);
        expect(utils_1.difference(obj)).toEqual(obj);
    });
    test('isDifference checking', () => {
        expect(utils_1.isDifference(obj, obj2)).toEqual(true);
        expect(utils_1.isDifference(obj)).toEqual(true);
        expect(utils_1.isDifference(arr1, arr2)).toEqual(true);
    });
});

//# sourceMappingURL=difference.test.js.map
