/**
 * 
 * This file is part of Forecast
 * 
 */

import { randomChoice, ModifyPrototypeSignal } from "./helper.js";
import { makeProxyObject, makeProxyArray, proxyString, toFixedValue } from "./proxy.js"

export type ExecutionResult = {
    polluted: boolean,
    async?: boolean,
    args: any[],
    result?: any,
    location?: ProtoPollutionLocation
    stringOperations?: StringOperation[];
}

export type StringOperation = {call: string, args: any[]};
export type ProtoPollutionLocation = {line: number, column: number};

/**
 * Forcefully execute a function. The executed function should be instrumented first.
 * 
 * @param f function to be execute
 * @param argCount number of arguments
 * @param thisArg `this` in the function execution (optional). `thisArg` should be 
 * retrieved in other forced executions (typically as the return object).
 * @returns the execution result
 * @
 */
export async function forcedExecution(f: Function, argCount: number, thisArg?: any) : Promise<ExecutionResult> {
    let argArray = [];
    for (let i = 0; i < argCount; i++) {
        argArray.push(randomChoice([
            function() { return makeProxyObject(); },
            function() { return proxyString },
            function() { return makeProxyArray(); },
            function() { return undefined; },
            function() { return null; },
        ]));
    }
    try {
        (globalThis as any).__strop = [];
        let result = f.apply(thisArg, argArray);
        let _async = false;
        if (result instanceof Promise) {
            result = await result;
            _async = true;
        }
        return {
            polluted: false, 
            args: argArray.map(x => toFixedValue(x)),
            result: toFixedValue(result),
            async: _async,
            stringOperations: (globalThis as any).__strop
        }
    } catch (e: any) {
        if (e instanceof ModifyPrototypeSignal) {
            return {
                polluted: true, 
                args: argArray.map(x => toFixedValue(x)),
                location: e.location,
                stringOperations: (globalThis as any).__strop
            };
        }
        throw new Error(`Error in forced execution: ${e.message}`);
        
    }
}