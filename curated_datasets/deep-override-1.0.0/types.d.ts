export function override<T, U>(target:T, source:U): T & U;
export function override<T, U, V>(target:T, source1:U, source2: V): T & U & V;