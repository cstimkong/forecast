const fs = require('fs');
const {instrumentCodeForForcedExecution} = require('../lib/instrumentation');
it('test instrumentation', function(done) {

    let functionContent = 'function f() { while (a < 3) {let a = () => { c = a[b]; }; a(c[d]);} }';

    console.log(instrumentCodeForForcedExecution(functionContent));
    done();
})

it('test instrumentation 2', function(done) {

    let functionContent = 'function f(a, b) { a.b(3); }';

    console.log(instrumentCodeForForcedExecution(functionContent));
    done();
})

it('test instrumentation file', function(done) {
    fs.readFile('./node_modules/json-pointer/index.js', {encoding: 'utf-8'}, (err, content) => {
        if (err) {
            console.error(err);
            done(err);
        } else {
            let c = instrumentCodeForForcedExecution(content, './node_modules/json-pointer/index.js');
            fs.writeFile('./instrumented-json-pointer.js', c, (err) => {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
        }
    })
})