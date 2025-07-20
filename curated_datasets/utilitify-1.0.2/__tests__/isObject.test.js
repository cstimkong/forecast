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
describe('This is the tests for the "is Object" util', () => {
    test('isObject checking', () => {
        expect(utils_1.isObject(obj)).toEqual(true);
        expect(utils_1.isObject(null)).toEqual(false);
        expect(utils_1.isObject(1)).toEqual(false);
    });
    test('isObjectObject checking', () => {
        expect(utils_1.isObjectObject(obj)).toEqual(true);
        expect(utils_1.isObjectObject(null)).toEqual(false);
        expect(utils_1.isObjectObject(1)).toEqual(false);
    });
    test('isPlainObject checking', () => {
        expect(utils_1.isPlainObject(obj)).toEqual(true);
        expect(utils_1.isPlainObject(null)).toEqual(false);
        expect(utils_1.isPlainObject(1)).toEqual(false);
    });
});

//# sourceMappingURL=isObject.test.js.map
