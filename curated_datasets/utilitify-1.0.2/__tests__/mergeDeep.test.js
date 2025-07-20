"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('This is the tests for the "merge deep" util', () => {
    test('Merge two objects', () => {
        expect(utils_1.mergeDeep({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
        expect(utils_1.mergeDeep({ a: 1, b: [2, 3] }, { b: [3, 4], c: 3 })).toEqual({
            a: 1,
            b: [2, 3, 4],
            c: 3,
        });
        expect(utils_1.mergeDeep(1, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(utils_1.mergeDeep({ a: 1, b: 2 }, 1)).toEqual({ a: 1, b: 2 });
        expect(utils_1.mergeDeep({ a: 1, b: [2, { c: 3 }] }, { b: [3, { c: 4 }], d: 3 })).toEqual({
            a: 1,
            b: [2, { c: 3 }, 3, { c: 4 }],
            d: 3,
        });
        expect(utils_1.mergeDeep({ a: 1, b: { c: 2 } }, { b: { c: 4 } })).toEqual({ a: 1, b: { c: 4 } });
        expect(utils_1.mergeDeep({ a: { b: { c: 'c', d: 'd' } } }, { a: { b: { e: 'e', f: 'f' } } }))
            .toEqual({
            a: {
                b: {
                    c: 'c', d: 'd', e: 'e', f: 'f',
                },
            },
        });
    });
});

//# sourceMappingURL=mergeDeep.test.js.map
