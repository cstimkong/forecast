/**
 * 
 * This file is part of Forecast
 * 
 */

import { createRequire } from 'module';
import path from 'path';
import {cwd} from 'process'
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { run } from './fuzzing.js';
import { addHook } from 'pirates';
import { instrument } from './instrument.js';
import { mockEnv } from './helper.js';

(async function() {
    let argv: any = yargs(hideBin(process.argv))
    .usage('Forecast tool for prototype pollution detection').option('path', {
        alias: 'p',
        type: 'string',
        description: 'JavaScript library path (used in require call)'
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
        description: 'Timeout of the Forecast execution in second'
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

    let revert = addHook((code, filename) => {
        return instrument(code, { filename });
    }, {exts: ['.js', '.cjs']});

    mockEnv();
    let require = createRequire('file://' + cwd() + '/');
    let lib = require(argv.path);
    revert();
    
    let opts: any = {};
    if (argv.maxExecutionTime) {
        opts.maxExecutionTime = argv.maxExecution as number;
    }
    let fuzzingResults = await run(lib, opts);
    for (let r of fuzzingResults) {
        
    }
})();