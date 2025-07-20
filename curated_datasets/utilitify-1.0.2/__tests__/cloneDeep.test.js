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
const arr = [{ a: 1 }, { b: 2 }];
const objWithoutOneProp = { a: 'b' };
const arrWithObjWithoutOneProp = [objWithoutOneProp];
const customCloneArray = (arrStr) => [...arrStr];
describe('This is the tests for the "deep clone" utils', () => {
    test('cloneDeep checking', () => {
        expect(utils_1.cloneDeep(obj)).toEqual(obj);
        expect(utils_1.cloneDeep(arr)).toEqual(arr);
        expect(utils_1.cloneDeep(1)).toEqual(1);
        const copy = utils_1.cloneDeep(arrWithObjWithoutOneProp);
        objWithoutOneProp.c = 'd';
        expect(copy).toEqual([{ a: 'b' }]);
        expect(arrWithObjWithoutOneProp).toEqual([{ a: 'b', c: 'd' }]);
    });
    test('cloneObjectDeep checking', () => {
        expect(utils_1.cloneObjectDeep(['1', '2'], customCloneArray)).toEqual(['1', '2']);
        expect(utils_1.cloneObjectDeep(['1', '2'])).toEqual(['1', '2']);
    });
});

//# sourceMappingURL=cloneDeep.test.js.map
