/**
 * 
 * This file is part of Forecast
 * 
 */

import { forcedExecution } from "./forced-execution.js";
import { isProxyString, randomChoice } from "./helper.js";
import { hasProxyStringProperty, proxyString } from "./proxy.js";
import { defaultOptionValues } from "./defaults.js";
import cloneDeep from 'clone-deep';

export type CallPath = (string | {args: any[], async?: boolean})[];

async function run(lib: any, options: {maxExecutionTime?: number, iterationCount?: number}) {
    let maxExecutionTime = options.maxExecutionTime || defaultOptionValues.maxExecutionTime;
    let iterationCount = options.iterationCount || defaultOptionValues.iterationCount;
    let candidates: {path: CallPath, ref: Function, thisArg?: any}[] = [];
    let successResults: CallPath[] = [];

    if (typeof lib === 'function') {
        candidates.push({path: [], ref: lib});
    } else {
        for (let x of Object.getOwnPropertyNames(lib)) {
            candidates.push({path: [x], ref: lib[x]});
        }
    }

    let iter = 0;
    while (iter < iterationCount && candidates.length > 0) {
        let p = candidates.shift();
        iter++;
        for (let i = 0; i < maxExecutionTime; i++) {
            let argCount = randomChoice([0, 1, 2, 3, 4].map(x => function() { return x; }));
            let result = await forcedExecution(p!.ref, argCount, p!.thisArg);
            if (result.polluted) {
                let clonedPath = cloneDeep(p!.path);
                clonedPath.push({args: result.args});
                successResults.push(clonedPath);
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

function stringifyObject(obj: any) {
    if (obj === null) {
        return 'null';
    }

    if (obj === undefined) {
        return 'undefined';
    }

    if (isProxyString(obj)) {
        return "[[proxystr]]";
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return JSON.stringify(obj);
    }

    if (typeof obj === 'object') {
        let s = '{';
        for (let x of Object.keys(obj)) {
            let k = JSON.stringify(x);
            let v = stringifyObject(obj[x]);
            s += k + ":" + v + ',';
        }
        if (s.endsWith(',')) {
            s = s.substring(0, s.length - 1);
        }
        s += "}";
        return s;
    }
}