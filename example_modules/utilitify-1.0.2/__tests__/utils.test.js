"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const objectWithEmptyProps = {
    a: 1,
    b: null,
    c: 'string',
    d: undefined,
    e: '',
};
const arr1 = [{ a: 1 }, { b: 2 }];
const arr2 = [{ first: 1 }, { second: 2 }];
describe('This is the tests for the "utils"', () => {
    test('isNil checking', () => {
        expect(utils_1.isNil(1)).toEqual(false);
        expect(utils_1.isNil(null)).toEqual(true);
        expect(utils_1.isNil(undefined)).toEqual(true);
    });
    test('isNull checking', () => {
        expect(utils_1.isNull(1)).toEqual(false);
        expect(utils_1.isNull(null)).toEqual(true);
        expect(utils_1.isNull(undefined)).toEqual(false);
    });
    test('isUndefined checking', () => {
        expect(utils_1.isUndefined(1)).toEqual(false);
        expect(utils_1.isUndefined(undefined)).toEqual(true);
        expect(utils_1.isUndefined(null)).toEqual(false);
    });
    test('getObjectWithoutEmptyPropsFrom checking', () => {
        expect(utils_1.getObjectWithoutEmptyPropsFrom(objectWithEmptyProps))
            .toEqual({ a: 1, c: 'string' });
    });
    test('getObjectWithoutUndefinedPropsFrom checking', () => {
        expect(utils_1.getObjectWithoutUndefinedPropsFrom(objectWithEmptyProps))
            .toEqual({
            a: 1,
            b: null,
            c: 'string',
            e: '',
        });
    });
    test('upsertObjectToArray checking', () => {
        utils_1.upsertObjectToArray(arr1, { c: 3 }, 3);
        expect(arr1).toEqual([{ a: 1 }, { b: 2 }, 3]);
        utils_1.upsertObjectToArray(arr2, { first: 1 }, { first: 3 });
        expect(arr2).toEqual([{ first: 3 }, { second: 2 }]);
    });
    test('getObjectFromArrayByProp checking', () => {
        expect(utils_1.getObjectFromArrayByProp(arr1, 'a')).toEqual({ a: 1 });
        expect(utils_1.getObjectFromArrayByProp(arr1, 'e')).toEqual({});
    });
    test('getArrayOfObjectsWithoutProp checking', () => {
        const arr = [{ a: 1, c: 10 }, { b: 2 }];
        expect(utils_1.getArrayOfObjectsWithoutProp(arr, 'a')).toEqual([{ c: 10 }, { b: 2 }]);
    });
});

//# sourceMappingURL=utils.test.js.map
