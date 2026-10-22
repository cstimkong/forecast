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
import objectHash from 'object-hash';
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
    .option('max-loop', {
        type: 'number',
        description: 'Max number of for/while iteration (0 for not limited)'
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
    .option('using-meta-templates', {
        type: 'boolean',
        default: true,
        description: 'Whether to use meta templates'
    })
    .option('mock', {
        type: 'boolean',
        default: true,
        description: 'Mock slow functions'
    })
    .option('debug',
        {
            type: 'boolean',
            default: false,
            description: 'Show debug information'
        }
    )
    .demandOption(['path'])
    .help().parse();

    let logger = pino({level: argv.debug ? 'debug' : 'info'});
    let revert = addHook((code, filename) => {
        let instrumentedCode = instrument(code, { filename, maxLoop: argv.maxLoop });
        logger.info(`instrumented code: ${instrumentedCode}`);
        return instrumentedCode;
    }, {exts: ['.js', '.cjs'], ignoreNodeModules: false});

    mockEnv();
    let require = createRequire('file://' + cwd() + '/');
    let lib = require(argv.path);
    revert();
    
    let opts: any = {};
    if (argv.maxExecutionTime) {
        opts.maxExecutionTime = argv.maxExecution as number;
    }
    
    opts.logger = logger;
    logger.info(`Start to test the library ${argv.path}`);
    let fuzzingResults = await run(lib, opts);
    if (fuzzingResults.length === 0) {
        logger.info('No candidate exploit path is found.');
    }

    logger.info(`Number of candidate paths: ${fuzzingResults.length}`);

    let hashValueSet = new Set();
    let filteredResults = [];
    for (let r of fuzzingResults) {
        let v = objectHash(r);
        if (!hashValueSet.has(v)) {
            filteredResults.push(r);
            hashValueSet.add(v);
        }
    }
    
    logger.info(`Number of candidate paths after filtering: ${filteredResults.length}`);

    if (argv.candidateOnly) {
        return;
    }
    
    let successResultMap = new Map();
    for (let r of filteredResults) {
        logger.debug(`Start to deal with the path ${stringifyPath(r.callPath)}`);
        let filledCallPaths = fillCallPath(r.callPath);
        for (let c of filledCallPaths) {
            makeExploit(c);
        }
        for (let p of filledCallPaths) {
            let sp = stringifyPath(p);
            logger.info(`Start to execute the path ${sp}`);
            try {
                await executeCallPath(lib, p);
            } catch (e) {
                if (e instanceof ModifyPrototypeSignal) {
                    // let h = objectHash(e.location)
                    let h = e.location.column + ',' + e.location.line;
                    if (!successResultMap.has(h)) {
                        successResultMap.set(h, {location: e.location, exploits: []});
                    }
                    successResultMap.get(h).exploits.push(sp);
                    logger.info(`Success exploit: ${sp}, Location: ${JSON.stringify(e.location)}`);
                }
                else if (e instanceof Error) {
                    logger.debug(`Error occured in the execution: ${e.message}`);
                }
            }
        }
    }

    logger.info('---------- Results ---------');

    for (let h of successResultMap.keys()) {
        let r: any = successResultMap.get(h);
        logger.info(`Location: ${JSON.stringify(r.location)}\nOne exploit: ${r.exploits[0]}`);
    }
})();