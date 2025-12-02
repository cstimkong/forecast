"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('This is the tests for the "array union" util', () => {
    test('union checking', () => {
        expect(utils_1.union([], 'left')).toEqual(['left']);
        expect(utils_1.union(['one'], null)).toEqual(['one']);
        expect(utils_1.union(['one'], ['two'])).toEqual(['one', 'two']);
        expect(utils_1.union(['one', 'two'], ['two', 'three'])).toEqual(['one', 'two', 'three']);
        expect(utils_1.union([1, 2], [2, 3])).toEqual([1, 2, 3]);
        expect(utils_1.union(['a'], ['b', 'c'], ['d', 'e', 'f'])).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(utils_1.union(['a', 'a'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
        try {
            expect(utils_1.union(undefined, 'left'));
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError);
        }
    });
});

//# sourceMappingURL=arrUnion.test.js.map
