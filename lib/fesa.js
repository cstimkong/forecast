
/**
 * 
 * This file is part of FesaJS
 * 
 */

const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const {addHook} = require('pirates');
const codeInstrumentation = require('./code-instrumentation');

const forcedExecution = require('./forced-execution');

function requireInstrumented(path) {
    let revert = addHook(function(code, filename) {
        return codeInstrumentation(code, filename);
    }, {ext: ['.js'], ignoreNodeModules: true});
    
    let lib = require(path);
    revert();
    return lib;
}


let argv = yargs(hideBin(process.argv))
.usage('FesaJS executable file').option('path', {
    alias: 'p',
    type: 'string',
    description: 'CommonJS librarh path (used in require call)'
})
.option('mocha', {
    type: 'boolean',
    description: 'Client JavaScript file or project use mocha as the test framework'
})
.option('all', {
    alias: 'a',
    type: 'boolean',
    default: true,
    description: 'Try to detect all paths'
})
.option('timeout', {
    type: 'number',
    default: 300,
    description: 'Timeout of the FesaJS execution in second'
  })
.option('detection-only', {
    type: 'boolean',
    default: false,
    description: 'Only detect the vulnerability, without exploitation'
  })
  .option('max-execution-time', {
    type: 'number',
    default: 1000,
    description: 'Max forced execution time'
  })
  .option('mock', {
    type: 'boolean',
    default: true,
    description: 'Mock slow functions'
  })

  .demandOption(['path'])
  .help().parse();

let lib = requireInstrumented(argv.path)

let funcs = [];
if (typeof lib === 'function') {
    funcs.push({func: lib, name: '<root>'});
}
for (let k in lib) {
    if (typeof lib[k] === 'function') {
        funcs.push({func: lib[k], name: `<root>.${k}`});
    }
}

console.log(funcs);
for (let item of funcs) {
    try {
        for (let i = 0; i < argv.maxExecutionTime; i++) {
            forcedExecution(item.func, 5);
        }
    } catch (e) {
        console.error(e.message);
    }
}