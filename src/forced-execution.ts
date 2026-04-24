import { randomChoice, ModifyPrototypeSignal } from "./helper.js";
import { makeProxyObject, makeProxyArray, proxyString } from "./proxy.js"
/**
 * Forcefully execute a function. The executed function should be instrumented first.
 * 
 * @param f function to be execute
 * @param argCount number of arguments
 * @param thisArg `this` in the function execution (optional). `thisArg` should be 
 * retrieved in other forced executions (typically as the return object).
 */
export async function forcedExecution(f: Function, argCount: number, thisArg: any, globalContext: any) {
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
        if (result instanceof Promise) {
            result = await result;
        }
        return [false, argArray.map(x => x.__INTERNAL__), result];
    } catch (e: any) {
        if (e instanceof Error) {
            throw new Error(`Error in forced execution: ${e.message}`);
        }
        if (e instanceof ModifyPrototypeSignal) {
            return [true, argArray.map(x => x.__INTERNAL__), undefined];
        }
        
    }
}