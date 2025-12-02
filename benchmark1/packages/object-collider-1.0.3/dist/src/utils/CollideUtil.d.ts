import { ICollideModifiers } from '../interfaces';
/**
 * collide 2 arguments
 * @param arg1 first argument to collide into (note: original object won't be modified directly)
 * @param arg2 second argument to collide from
 * @param modifiers
 * @param startPath the entry path to start modifier path generation. Default value: $
 * @returns collide result
 */
export declare function collide(arg1: any, arg2: any, modifiers?: ICollideModifiers, startPath?: string): any;
/**
 * Collide unsafe (arg1 may be modified directly)
 * @param arg1 first argument to collide into (note: original object will be modified directly)
 * @param arg2 second argument to collide from
 * @param modifiers
 * @param startPath the entry path to start modifier path generation. Default value: $
 * @returns collide result
 */
export declare function collideUnsafe(arg1: any, arg2: any, modifiers?: ICollideModifiers, startPath?: string): any;
