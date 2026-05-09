import { randomChoice, ModifyPrototypeSignal } from "./helper.js";
import { makeProxyObject, makeProxyArray, proxyString, toFixedValue } from "./proxy.js"

export type ExecutionResult = {
    polluted: boolean,
    async?: boolean,
    args: any[],
    result?: any,
    location?: {line: number, column: number}
}

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
        let result = f.apply(thisArg, argArray);
        let _async = false;
        if (result instanceof Promise) {
            result = await result;
            _async = true;
        }
        return {
            polluted: false, 
            args: argArray.map(x => toFixedValue(x)),
            result: result,
            async: _async
        }
    } catch (e: any) {
        if (e instanceof ModifyPrototypeSignal) {
            return {
                polluted: true, 
                args: argArray.map(x => toFixedValue(x)),
                location: e.location
            };
        }
        throw new Error(`Error in forced execution: ${e.message}`);
        
    }
}