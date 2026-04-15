import loadNodeJsModule from '../lib/moduleloader.js';
import { instrumentCodeForForcedExecution } from '../lib/sourcecode.js';
it('test load the instrumented library', function(done) {
    let globalObj = {}
    globalObj.__getdeflocation__ = function(f) {
        // Simply output
        console.log('Loaded function:', f);
        return f.name;
    }
    globalObj.__getcreationlocation__ = function(o) {
        // Simply output
        console.log('Location:', o)
    }

    globalObj.__record__ = function(x) {
        console.log(x);
    }

    let [obj, files] = loadNodeJsModule('./example_modules/assign-deep-0.4.6/', false, {returnSourceFiles: true, instrumentFunc: function(sourceCode, filename) {
        return instrumentCodeForForcedExecution(sourceCode, filename);
    }, globalThis: globalObj});
    console.log(obj);
    console.log('files:', files);
    done();
})