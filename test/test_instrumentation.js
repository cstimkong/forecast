import fs from 'fs';
import path from 'path';
import module from 'module';
import {instrument} from '../lib/instrument.js';
import {mockedArrayPrototype, mockedFunctionPrototype, mockedObjectPrototype} from '../lib/proxy.js'
it('test instrumentation', function(done) {

    let functionContent = 'var a = typeof "a";';

    console.log(instrument(functionContent));
    done();
});

it('test instrumentation of joi', function(done) {
    let content = fs.readFileSync(path.join(import.meta.dirname, 'joi-18.1.2.min.cjs'), {encoding: 'utf-8'});
    let instrumentedCode = instrument(content);
    fs.writeFileSync('joi-instrumented.cjs', instrumentedCode);
    let require = module.createRequire(import.meta.dirname);
    globalThis.__mockedObjectPrototype = mockedObjectPrototype;
    globalThis.__mockedArrayPrototype = mockedArrayPrototype;
    globalThis.__mockedFunctionPrototype = mockedFunctionPrototype;
    console.log(require('./joi-instrumented.cjs'));
    done();
});
