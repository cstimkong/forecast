
import {forcedExecution} from '../lib/forced-execution.js';
import {proxyString, makeProxyObject} from '../lib/proxy.js';
import module from 'module';
import {mockedArrayPrototype, mockedFunctionPrototype, mockedObjectPrototype} from '../lib/proxy.js'
import { mockedCompare, mockedPropertyAccess } from '../lib/helper.js';
describe('test forced execution', function() {
    it('test forced execution 1', function(done) {
        let r = module.createRequire(import.meta.dirname);
        globalThis.__mockedObjectPrototype = mockedObjectPrototype;
        globalThis.__mockedArrayPrototype = mockedArrayPrototype;
        globalThis.__mockedFunctionPrototype = mockedFunctionPrototype;
        globalThis.__mockedCompare = mockedCompare;
        globalThis.__mockedPropertyAccess = mockedPropertyAccess;
        let jp = r('./json-pointer-instrumented.cjs');
        for (let i = 0; i < 200; i++) {
            try {
                let result = jp.set(makeProxyObject(), proxyString, proxyString);
                // console.log(result);
            } catch (e) {
                console.log(e);
            }
        }
        done();
    });
});


