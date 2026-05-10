import {stringifyArgument, stringifyPath} from '../lib/engine.js';
import {proxyString} from '../lib/proxy.js';

describe('test engine implementation', function() {
    it('test stringify argument', function() {
        console.log(stringifyArgument({a: '3', b: 4, c: {d: proxyString, e: {f: {g: {h: {}}}}}}, 4));
    });

    it('test stringify path', function() {
        console.log(stringifyPath(['func1', { args: [{a: proxyString, b: {c: 3}}] }, 'func2']));
    });
});