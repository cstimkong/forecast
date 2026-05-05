/**
 * 
 * This file is part of Forecast
 * 
 */

import { forcedExecution } from "./forced-execution.js";
import { isProxyString, randomChoice } from "./helper.js";
import { proxyString } from "./proxy.js";
import cloneDeep from 'clone-deep';

type CallPath = (string | {args: any[]})[];

async function run(lib: any, maxExecutionTime: number) {
    let candidates: {path: CallPath, ref: Function, thisArg?: any}[] = [];
    let successResults: CallPath[] = [];

    if (typeof lib === 'function') {
        candidates.push({path: [], ref: lib});
    } else {
        for (let x of Object.getOwnPropertyNames(lib)) {
            candidates.push({path: [x], ref: lib[x]});
        }
    }


    while (true) {
        let p = candidates.shift();
        for (let i = 0; i < maxExecutionTime; i++) {
            let argCount = randomChoice([0, 1, 2, 3, 4].map(x => function() { return x; }));
            let result = await forcedExecution(p!.ref, argCount, p!.thisArg);
            if (result.polluted) {
                let clonedPath = cloneDeep(p!.path);
                clonedPath.push({args: result.args});
                successResults.push(clonedPath);
            } else {
                
            }
        }
    }
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