
/**
 * 
 * This file is part of FesaJS
 * 
 */

const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const loadNodeJSModule = require('./lib/loadmodule');
const { generateTemplateArgArrays } = require('./lib/engine');
const { solve } = require('./lib/staticanalysis');

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
  .option('debug',
    {
        type: 'boolean',
        default: false
    }
  )
  .demandOption(['path'])
  .help().parse();
