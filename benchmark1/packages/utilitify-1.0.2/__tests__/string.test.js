"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('This is the tests for the "string" utils', () => {
    test('getTruncatedString checking', () => {
        expect(utils_1.getTruncatedString('longString', 4)).toEqual('long');
        expect(utils_1.getTruncatedString('longString', 4, '...')).toEqual('long...');
        expect(utils_1.getTruncatedString('', 4)).toEqual('');
        expect(utils_1.getTruncatedString('short', 6)).toEqual('short');
        expect(utils_1.getTruncatedString(null, 6)).toEqual('');
    });
    test('isJsonString checking', () => {
        expect(utils_1.isJsonString('a')).toEqual(false);
        expect(utils_1.isJsonString('{"e":2}')).toEqual(true);
    });
    test('getJsonFromString checking', () => {
        expect(utils_1.getJsonFromString('a')).toEqual({});
        expect(utils_1.getJsonFromString('{"e":2}')).toEqual({ e: 2 });
    });
    test('toPascalCase checking', () => {
        expect(utils_1.toPascalCase('pascalCase')).toEqual('PascalCase');
        expect(utils_1.toPascalCase('pascal-Case')).toEqual('PascalCase');
        expect(utils_1.toPascalCase('pascal case')).toEqual('PascalCase');
    });
});

//# sourceMappingURL=string.test.js.map
