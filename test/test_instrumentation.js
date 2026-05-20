import fs from 'fs';
import path from 'path';
import module from 'module';
import {instrument} from '../lib/instrument.js';
import {mockedCompare, mockedPropertyAccess, mockedPropertyWrite, mockEnv } from '../lib/helper.js';
it('test instrumentation', function(done) {

    let functionContent = 'var a = typeof "a"; a.name = 3;';

    console.log(instrument(functionContent));
    done();
});

it('test instrumentation of joi', function(done) {
    let content = fs.readFileSync(path.join(import.meta.dirname, 'joi-18.1.2.min.cjs'), {encoding: 'utf-8'});
    let instrumentedCode = instrument(content);
    fs.writeFileSync('joi-instrumented.cjs', instrumentedCode);
    let require = module.createRequire(import.meta.dirname);
    mockEnv();
    let joi = require('./joi-instrumented.cjs');
    console.log(joi.array().validate);
    done();
});

it('test instrumentation of json-pointer', function(done) {
    let content = fs.readFileSync(path.join(import.meta.dirname, 'json-pointer-0.4.0.cjs'), {encoding: 'utf-8'});
    let instrumentedCode = instrument(content);
    fs.writeFileSync('json-pointer-instrumented.cjs', instrumentedCode);
    let require = module.createRequire(import.meta.dirname);

    mockEnv();
    let jp = require('./json-pointer-instrumented.cjs');
    console.log(jp.set({}, '/a/b', 'c'));
    done();
});
