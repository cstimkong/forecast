/**
 * 
 * This file is part of Forecast
 * 
 */

import { forcedExecution, ProtoPollutionLocation, StringOperation } from "./forced-execution.js";
import { isProxyString, randomChoice } from "./helper.js";
import { hasProxyStringProperty } from "./proxy.js";
import { defaultOptionValues } from "./defaults.js";
import cloneDeep from 'clone-deep';
import pino from 'pino';
import { isProxy } from "util/types";

export type CallPath = (string | {args: any[], async?: boolean, stringOperations?: StringOperation[]})[];

/**
 * Evaluate the library and output the possible call paths along with the prototype pollution locations.
 * 
 * @param lib the object referring to a library
 * @param options Options for running
 * @returns An array of call path and prototype pollution location pairs
 */
export async function run(lib: any, options?: {maxExecutionTime?: number, iterationCount?: number, loggerEnabled?: boolean}) {
    if (options === undefined) {
        options = {};
    }
    let logger = pino();
    let maxExecutionTime = options.maxExecutionTime || defaultOptionValues.maxExecutionTime;
    let iterationCount = options.iterationCount || defaultOptionValues.iterationCount;
    let candidates: {path: CallPath, ref: Function, thisArg?: any}[] = [];
    let successResults: [CallPath, ProtoPollutionLocation][] = [];

    if (typeof lib === 'function') {
        candidates.push({path: [], ref: lib});
        logger.info(`Added function (library itself).`);
    }
    for (let x of Object.keys(lib)) {
        if (typeof lib[x] === 'function') {
            candidates.push({path: [x], ref: lib[x]});
            logger.info(`Added function (.${x}).`);
        }
    }
    

    let iter = 0;
    while (iter < iterationCount && candidates.length > 0) {
        let p = candidates.shift();
        logger.info(`Processing ${stringifyPath(p!.path)}.`);

        iter++;
        for (let i = 0; i < maxExecutionTime; i++) {
            let argCount = randomChoice([0, 1, 2, 3, 4].map(x => function() { return x; }));
            let result;
            try {
                result = await forcedExecution(p!.ref, argCount, p!.thisArg);
            } catch (e: any) {
                logger.debug(`Forced execution error: ${e.message}`);
                continue;
            }
            
            if (result.polluted) {
                let clonedPath = cloneDeep(p!.path);
                clonedPath.push({args: result.args, stringOperations: result.stringOperations!});
                successResults.push([clonedPath, result.location!]);
                logger.info(`Prototype pollution triggered at ${stringifyPath(clonedPath)}, location: Line ${result.location!.line}, Column: ${result.location!.column}`);
            } else {
                if (typeof result.result === 'object' && searchProxyString(result.result, 4)) {
                    for (let x in result.result) {
                        if (typeof result.result[x] === 'function') {
                            let clonedPath = cloneDeep(p!.path);
                            clonedPath.push({args: result.args, async: result.async!}, x);
                            candidates.push({path: clonedPath, ref: result.result[x], thisArg: result.result});
                        }
                    }
                }
            }
        }
    }

    return successResults;
}

function searchProxyString(obj: any, maxDepth: number) {
    if (isProxyString(obj))
        return false;

    if (typeof obj !== 'object' || obj === null || obj === undefined)
        return false;

    if (maxDepth <= 0)
        return false;
    if (hasProxyStringProperty(obj)) {
        return true;
    }
    for (let x of Object.keys(obj)) {
        if (searchProxyString(obj[x], maxDepth - 1)) {
            return true;
        }
    }
    return false;
}

/**
 * Make the call path human readable.
 */
export function stringifyPath(p: CallPath) {
    let s = "";
    for (let x of p) {
        if (typeof x === 'string') {
            s += "." + x;
        }
        else {
            let t = "(";
            for (let e of x.args) {
                t += stringifyArgument(e, 4) + ',';
            }
            if (t.endsWith(',')) {
                t = t.substring(0, t.length - 1);
            }
            t += ")";
            if (x.async) {
                s = '(await ' + s + t + ')';
            } else {
                s += t;
            }
        }
    }
    return s;
}

/**
 * Make the argument human readable
 */
export function stringifyArgument(obj: any, maxDepth: number) {
    if (maxDepth === 0) {
        return '[...]';
    }

    if (obj === null) {
        return 'null';
    }

    if (obj === undefined) {
        return 'undefined';
    }

    if (isProxyString(obj)) {
        return "__proxystr__";
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return JSON.stringify(obj);
    }

    if (typeof obj === 'object') {
        let s = '{';
        for (let x of Object.keys(obj)) {
            let k = JSON.stringify(x);
            let v = stringifyArgument(obj[x], maxDepth - 1);
            s += k + ":" + v + ',';
        }
        if (s.endsWith(',')) {
            s = s.substring(0, s.length - 1);
        }
        s += "}";
        return s;
    }
}