import {mockedCompare, mockedPropertyAccess} from './lib/helper.js';

import { mockedArrayPrototype, mockedObjectPrototype, mockedFunctionPrototype, proxyString } from './lib/proxy.js';
import module from 'module';

globalThis.__mockedObjectPrototype = mockedObjectPrototype;
globalThis.__mockedArrayPrototype = mockedArrayPrototype;
globalThis.__mockedFunctionPrototype = mockedFunctionPrototype;
globalThis.__mockedCompare = mockedCompare;
globalThis.__mockedPropertyAccess = mockedPropertyAccess;
console.log(import.meta.dirname);
let r = module.createRequire(import.meta.url);
let jp = r('./json-pointer-instrumented.cjs');
console.log(jp);

for (let i = 0; i < 1000; i++) {
    try {
        let o = Object.create(mockedObjectPrototype);
        jp.set(o, proxyString, proxyString);
        console.log(o);
    } catch (e) {
        console.log(e);
    }
    
}

