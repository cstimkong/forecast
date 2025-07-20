"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const func1 = (value) => value + 1;
const func2 = (value) => value * 2;
describe('This is the tests for the "compose" util', () => {
    test('compose checking', () => {
        expect(utils_1.compose(func1, func2)(1)).toEqual(4);
        expect(utils_1.compose()(1)).toEqual(1);
        try {
            expect(utils_1.compose(func1, {})(1)).toEqual(4);
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError);
        }
    });
});

//# sourceMappingURL=compose.test.js.map
