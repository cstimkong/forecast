import {stringifyArgument, stringifyPath, run} from '../lib/engine.js';
import { mockedCompare, mockedPropertyAccess, mockedPropertyWrite } from '../lib/helper.js';
import {proxyString} from '../lib/proxy.js';
import module from 'module';

describe('test engine implementation', function() {
    it('test stringify argument', function() {
        console.log(stringifyArgument({a: '3', b: 4, c: {d: proxyString, e: {f: {g: {h: {}}}}}}, 4));
    });

    it('test stringify path', function() {
        console.log(stringifyPath(['func1', { args: [{a: proxyString, b: {c: 3}}] }, 'func2']));
    });

    it('test run', async function() {
        let r = module.createRequire(import.meta.dirname);
        globalThis.__mockedCompare = mockedCompare;
        globalThis.__mockedPropertyAccess = mockedPropertyAccess;
        globalThis.__mockedPropertyWrite = mockedPropertyWrite;
        let jp = r('./json-pointer-instrumented.cjs');
        let result = await run(jp);
        // console.log(result);

        // for (let r of result) {
        //     console.log(stringifyPath(r[0]), r[1]);
        // }
    })
});