"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const obj = {
    a: 1,
    b: 2,
    c: 3,
};
const map = new Map();
map.set('one', 1);
const set = new Set();
set.add('set');
const date = new Date('2019-09-02');
const symbol = Symbol.for('symbol');
const arrayBuffer = new ArrayBuffer(3);
const float32array = new Float32Array();
const float64array = new Float64Array();
const int16array = new Int16Array();
const int32array = new Int32Array();
const int8array = new Int8Array();
const uint16array = new Uint16Array();
const uint32array = new Uint32Array();
const uint8clampedArray = new Uint8ClampedArray();
const uint8array = new Uint8Array();
const regExp = /[1-4]\/g/;
const error = new Error('error');
describe('This is the tests for the "shallow clone" utils', () => {
    test('cloneShallow checking', () => {
        expect(utils_1.cloneShallow([1, 2])).toEqual([1, 2]);
        expect(utils_1.cloneShallow(obj)).toEqual(obj);
        expect(utils_1.cloneShallow(date)).toEqual(date);
        expect(utils_1.cloneShallow(map)).toEqual(map);
        expect(utils_1.cloneShallow(set)).toEqual(set);
        expect(utils_1.cloneShallow(symbol)).toEqual(Object(Symbol.prototype.valueOf.call(symbol)));
        expect(utils_1.cloneShallow(arrayBuffer)).toEqual(arrayBuffer);
        expect(utils_1.cloneShallow(float32array)).toEqual(float32array);
        expect(utils_1.cloneShallow(float64array)).toEqual(float64array);
        expect(utils_1.cloneShallow(int16array)).toEqual(int16array);
        expect(utils_1.cloneShallow(int32array)).toEqual(int32array);
        expect(utils_1.cloneShallow(int8array)).toEqual(int8array);
        expect(utils_1.cloneShallow(uint16array)).toEqual(uint16array);
        expect(utils_1.cloneShallow(uint32array)).toEqual(uint32array);
        expect(utils_1.cloneShallow(uint8clampedArray)).toEqual(uint8clampedArray);
        expect(utils_1.cloneShallow(uint8array)).toEqual(uint8array);
        expect(utils_1.cloneShallow(regExp)).toEqual(regExp);
        expect(utils_1.cloneShallow(error)).toEqual(error);
    });
    test('cloneRegExp checking', () => {
        expect(utils_1.cloneRegExp(new RegExp('\\+'))).toEqual(/\+/);
    });
});

//# sourceMappingURL=cloneShallow.test.js.map
