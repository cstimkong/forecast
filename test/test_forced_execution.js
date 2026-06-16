
import {forcedExecution} from '../lib/forced-execution.js';
import {proxyString, makeProxyObject} from '../lib/proxy.js';
import module from 'module';
import {sep} from 'path';
import { mockedCompare, mockedPropertyAccess, mockedPropertyWrite, mockEnv } from '../lib/helper.js';

it('Test forced execution', function(done) {
    let _require = module.createRequire('file://' + import.meta.dirname + sep + 'modules' + sep);
    mockEnv();
    let maxIterationTime = 500;
    let jp = _require('./json-pointer-instrumented.cjs');
    for (let i = 0; i < maxIterationTime; i++) {
        try {
            let result = jp.set(makeProxyObject(), proxyString, proxyString);
        } catch (e) {
            console.log(e);
        }
    }
    done();
});



