/**
 * 
 * This file is part of Forecast
 * 
 */

import { createRequire } from 'module';
import {cwd} from 'process'
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { run, stringifyPath } from './fuzzing.js';
import { addHook } from 'pirates';
import pino from 'pino';
import { instrument } from './instrument.js';
import { mockEnv, ModifyPrototypeSignal } from './helper.js';
import { executeCallPath, fillCallPath, makeExploit } from './exploitation.js';

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
    .option('candidate-only', {
        type: 'boolean',
        default: false,
        description: 'Only detect the candidate vulnerability, without actual exploitation'
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

    let logger = pino();
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

    logger.info(`Start to test the library ${argv.path}`);
    let fuzzingResults = await run(lib, opts);
    if (fuzzingResults.length === 0) {
        logger.info('No candidate exploit path is found.');
    }
    if (argv.candidateOnly) {
        return;
    }
    
    for (let r of fuzzingResults) {
        logger.info(`Start to deal with the path ${stringifyPath(r.callPath)}`);
        let filledCallPaths = fillCallPath(r.callPath);
        for (let c of filledCallPaths) {
            makeExploit(c);
        }
        for (let p of filledCallPaths) {
            logger.info(`Start to execute with the path ${JSON.stringify(p)}`);
            try {
                await executeCallPath(lib, p);
            } catch (e) {
                if (e instanceof ModifyPrototypeSignal) {
                    logger.info(`Success exploit: ${stringifyPath(p)}`);
                }
                else if (e instanceof Error) {
                    logger.debug(`Error occured in the execution: ${e.message}`);
                }
            }
        }
    }
})();