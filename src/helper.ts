
/**
 * 
 * This file is part of Forecast.
 */

import { isProxyString, proxyString } from "./proxy.js";
import { defaultOptionValues } from "./defaults.js";

export function makeArbitraryString(): string {
    let length = Math.floor(Math.random() * 10) + 1;
    let str = '';
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(Math.floor(Math.random() * 25) + 97);
    }
    return str;
}

export function makeArbitraryNumber(): number {
    return randomChoice([
        function () {
            return Math.floor(Math.random() * 10);
        },
        function () {
            return Math.floor(Math.random() * 100);
        },
        function () {
            return Math.floor(Math.random() * 1000);
        },
        function () {
            return Math.floor(Math.random() * 10000);
        },
        function () {
            return Math.floor(Math.random() * 100000);
        },
    ])
}

export function makeRandomId() {
    return makeArbitraryString();
}

export function randomChoice<T>(funcs: { (): T }[]) {
    let idx = Math.floor(Math.random() * funcs.length);
    return funcs[idx]!();
}

export function randomElement(e: any[]) {
    let idx = Math.floor(Math.random() * e.length);
    return e[idx];
}


export class ModifyPrototypeSignal {
    obj: any;
    location: { line: number, column: number };
    prop?: any;
    constructor(obj: any, location: { line: number, column: number }, prop?: any) {
        this.obj = obj;
        this.location = location;
        this.prop = prop;
    }
}

export function mockedCompare(a: any, b: any, op: string) {
    let tainted = [false, false];
    if (isProxyString(a)) {
        tainted[0] = true;
    }
    if (isProxyString(b)) {
        tainted[1] = true;
    }
    if (!tainted[0] && !tainted[1]) {
        switch (op) {
            case '===':
                return a === b;
            case '!==':
                return a !== b;
            case '==':
                return a == b;
            case '!=':
                return a != b;
        }
    }
    else {
        if (!tainted[0] && tainted[1]) {
            if ((globalThis as any).__strop !== undefined && typeof a === 'string') {
                ((globalThis as any).__strop as Array<any>).push({ call: op, args: [a] });
            }
        }
        if (tainted[0] && !tainted[1] && typeof b === 'string') {
            if ((globalThis as any).__strop !== undefined) {
                ((globalThis as any).__strop as Array<any>).push({ call: op, args: [b] });
            }
        }
        return randomChoice([
            function () { return true; },
            function () { return false; }
        ]);
    }
}

export function mockedPropertyAccess(e: any, p: any) {
    if (isProxyString(p)) {
        if (typeof e === 'object' || typeof e === 'function') {
            return randomChoice([
                function () { return Object.getPrototypeOf(e); },
                function () { return undefined; },
                function () { return e[defaultOptionValues.proxyStringLiteral] }
            ])

        }
    }
    return e[p];
}

export function mockedPropertyWrite(e: any, p: any, v: any, loc: { line: number, column: number }) {
    if (e === Object.prototype) {
        if (isProxyString(p))
            throw new ModifyPrototypeSignal('Object.prototype', loc);
        else if (typeof p === 'string')
            throw new ModifyPrototypeSignal('Object.prototype', loc, p);
    }

    else if (e === Array.prototype) {
        if (isProxyString(p))
            throw new ModifyPrototypeSignal('Array.prototype', loc);
        else if (typeof p === 'string')
            throw new ModifyPrototypeSignal('Array.prototype', loc, p);
    }

    else if (e === Function.prototype) {
        if (isProxyString(p))
            throw new ModifyPrototypeSignal('Function.prototype', loc);
        else if (typeof p === 'string')
            throw new ModifyPrototypeSignal('Function.prototype', loc, p);
    }

    else if (e === Map.prototype) {
        if (isProxyString(p))
            throw new ModifyPrototypeSignal('Map.prototype', loc);
        else if (typeof p === 'string')
            throw new ModifyPrototypeSignal('Map.prototype', loc, p);
    }

    if (typeof p === 'string') {
        e[p] = v;
    }
    else if (isProxyString(p)) {
        e[defaultOptionValues.proxyStringLiteral] = v;
    }

    return v;
}

export function mockedInExpression(a: any, b: any) {
    if (typeof b !== 'object' && typeof b !== 'function') {
        throw new Error('Unallowed operation');
    }
    if (isProxyString(b)) {
        throw new Error('Unallowed operation');
    }
    return a in b;
}

export function mockedObjectKeys(obj: any) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === defaultOptionValues.proxyStringLiteral) {
            keys[i] = proxyString;
        }
    }
    return keys;
}

function mockedEncodeURIComponent(s: string) {
    if (isProxyString(s)) {
        return proxyString;
    }
    return encodeURIComponent(s);
}

function mockedEncodeURI(s: string) {
    if (isProxyString(s)) {
        return proxyString;
    }
    return encodeURI(s);
}

function mockedDecodeURIComponent(s: string) {
    if (isProxyString(s)) {
        return proxyString;
    }
    return decodeURIComponent(s);
}

function mockedDecodeURI(s: string) {
    if (isProxyString(s)) {
        return proxyString;
    }
    return decodeURI(s);
}

function mockedEscape(s: string) {
    if (isProxyString(s)) {
        return proxyString;
    }
    return escape(s);
}

function mockedRegExp(pattern: string, flags?: string) {
    return new Proxy(new RegExp(pattern, flags), {
        get: function (target, p) {
            if (p === 'exec') {
                return function () {
                    if (isProxyString(arguments[0])) {
                        return randomChoice([
                            function () { return [proxyString] },
                            function () { return [proxyString, proxyString] },
                            function () { return [proxyString, proxyString, proxyString] },
                            function () { return null; }
                        ]);
                    } else {
                        return RegExp.prototype.exec.apply(target, arguments as any);
                    }
                }
            }
            else if (p === 'test') {
                return function () {
                    if (isProxyString(arguments[0])) {
                        return randomChoice([
                            function () { return false; },
                            function () { return true; }
                        ]);
                    } else {
                        return RegExp.prototype.test.apply(target, arguments as any);
                    }
                }
            }
            else {
                return (target as any)[p];
            }
        }
    });

}

export function mockEnv() {
    (globalThis as any).__mockedCompare = mockedCompare;
    (globalThis as any).__mockedPropertyAccess = mockedPropertyAccess;
    (globalThis as any).__mockedPropertyWrite = mockedPropertyWrite;
    (globalThis as any).__mockedInExpression = mockedInExpression;
    (globalThis as any).__mockedObjectKeys = mockedObjectKeys;
    (globalThis as any).__mockedEncodeURIComponent = mockedEncodeURIComponent;
    (globalThis as any).__mockedEncodeURI = mockedEncodeURI;
    (globalThis as any).__mockedDecodeURIComponent = mockedDecodeURIComponent;
    (globalThis as any).__mockedEscape = mockedEscape;
    (globalThis as any).__mockedDecodeURI = mockedDecodeURI;
    (globalThis as any).__mockedRegExp = mockedRegExp;
    (globalThis as any).window = new Proxy({}, {
        get: function (target, p) {
            if (p === Symbol.toPrimitive) {
                return function () {
                    return makeArbitraryString();
                }
            }
            return (globalThis as any).window;
        },

        apply: function () {
            return (globalThis as any).window;
        },
        construct: function () {
            return (globalThis as any).window;
        }
    });;
}