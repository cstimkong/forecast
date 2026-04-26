
/**
 * 
 * This file is part of FesaJS
 */

/* Helper functions for FesaJS  */

export function makeArbitraryString(): string {
    let length = Math.floor(Math.random() * 10);
    let str = '';
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
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

export function randomChoice<T>(funcs: {(): T}[]) {
    let idx = Math.floor(Math.random() * funcs.length);
    return funcs[idx]!();
}

export class ModifyPrototypeSignal {
    obj: any;
    prop: any;
    value: any;
    constructor(obj: any, prop: any, value: any) {
        this.obj = obj;
        this.prop = prop;
        this.value = value;
    }
}

export function mockedCompare(a: any, b: any, op: string) {
    let tainted = [false, false];
    if (typeof a === 'object' && a !== null && a.__TYPEOF__ === 'string') {
        tainted[0] = true;
    }
    if (typeof b === 'object' && b !== null && b.__TYPEOF__ === 'string') {
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
        return randomChoice([
            function() { return true; },
            function() { return false; }
        ]);
    }
}