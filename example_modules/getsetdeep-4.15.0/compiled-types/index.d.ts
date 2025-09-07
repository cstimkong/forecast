interface SetterOptions {
	/** If true, only set the attribute if its source value is empty */
	onlyIfEmpty?: boolean
}
/** An indexed object that we can operate on */
declare type IndexedObject = {
	[key: string]: any
}
/** A model that we can operate on */
interface Model {
	get(key: string): any
	set(attrs: IndexedObject, opts?: SetterOptions): any
}
/** Get a nested value within the subject */
export declare function getDeep(
	subject: IndexedObject | Model,
	keys: string | string[]
): any
/** Set a nested value within the subject */
export declare function setDeep(
	subject: IndexedObject | Model,
	keys: string | string[],
	value: any,
	opts?: SetterOptions
): any
export {}
//# sourceMappingURL=index.d.ts.map
