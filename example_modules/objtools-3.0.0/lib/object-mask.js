// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var objtools = require('./index');
var XError = require('xerror');
var _ = require('lodash');

/**
 * This class represents a mask, or whitelist, of fields on an object. Such
 * a mask is stored in a format that looks like this:
 *
 * { foo: true, bar: { baz: true } }
 *
 * This mask applies to the properties "foo" and "bar.baz" on an object.
 * Wilcards can also be used:
 *
 * { foo: false, bar: false, _: true }
 *
 * This will allow all fields but foo and bar. The use of arrays with
 * a single element is equivalent to the use of wildcards, as arrays in
 * the masked object are treated as objects with numeric keys. These
 * two masks are equivalent:
 *
 * { foo: [ { bar: true, baz: true } ] }
 *
 * { foo: { _: { bar: true, baz: true } } }
 *
 * Note: array-type wildcards are converted to underscores on instantiation
 *
 * @class ObjectMask
 * @constructor
 * @param {Object} mask - The data for the mask
 */
class ObjectMask {

	constructor(mask) {
		this.mask = underscorizeArrays(_.cloneDeep(mask));
		Object.defineProperty(this, '_isObjectMask', { value: true });
	}

	/**
	 * Creates a structured mask given a list of fields that should be included in the mask.
	 *
	 * @method createMaskFromFieldList
	 * @static
	 * @param {String[]} fields - Array of fields to include
	 * @return {ObjectMask} - The created mask
	 */
	static createMaskFromFieldList(fields) {
		var ret = {};
		var field;
		// We sort fields by length, long to short, to avoid more specific fields clobbering
		// less specific fields.
		fields = fields.slice(0).sort((a, b) => b.length - a.length);
		for (field of fields) {
			objtools.setPath(ret, field, true);
		}
		return new ObjectMask(ret);
	}

	/**
	 * Combines two or more masks such that the result mask matches fields matched by
	 * any of the combined masks.
	 *
	 * @method addMasks
	 * @static
	 * @param {ObjectMask|Object} mask1
	 * @param {ObjectMask|Object} mask2...
	 * @return {ObjectMask} - The result of adding together the component masks
	 */
	static addMasks() {
		var resultMask = false;
		var curArg;
		var argIdx;
		for (argIdx = 0; argIdx < arguments.length; argIdx++) {
			curArg = arguments[argIdx];
			if (ObjectMask.isObjectMask(curArg)) {
				curArg = curArg.toObject();
			}
			resultMask = addMask(resultMask, curArg);
			if (resultMask === true) return true;
		}
		return new ObjectMask(resultMask || false);
	}

	/**
	 * Combines two or more masks such that the result mask matches fields matched by
	 * the first mask but not the second
	 *
	 * @method subtractMasks
	 * @static
	 * @param {ObjectMask|Object} min - the minuend
	 * @param {ObjectMask|Object} sub - the subtrahend
	 * @return {ObjectMask} - The result of subtracting the second mask from the first
	 */
	static subtractMasks(min, sub) {
		const mask = (ObjectMask.isObjectMask(min)) ? min.clone().toObject() : objtools.deepCopy(min);
		return new ObjectMask(mask).subtractMask(sub);
	}

	/**
	 * Inverts a mask. The resulting mask disallows all fields previously allowed,
	 * and allows all fields previously disallowed.
	 * @static
	 * @param {ObjectMask} - the mask to invert
	 * @returns {ObjectMask} - the inverted mask
	 */
	static invertMask(mask) {
		if (ObjectMask.isObjectMask(mask)) mask = mask.mask;
		return new ObjectMask(invert(mask));
	}

	/**
	 * Check if an object is an ObjectMask
	 *
	 * @static
	 * @param {Object} obj - the object to determine if is an ObjectMask
	 * @return {Boolean} true if obj is an ObjectMask, false otherwise
	 */
	static isObjectMask(obj) {
		return !!(obj && obj._isObjectMask);
	}

	/**
	 * Subtracts a mask
	 *
	 * @method subtractMask
	 * @throws {XError} throws on (deep) attempt to subtract non-boolean scalars
	 * @param {ObjectMask|Object} mask - the mask to subtract
	 * @return {ObjectMask} - returns new mask
	 */
	subtractMask(mask) {
		this.mask = subtract(this.mask, ObjectMask.isObjectMask(mask) ? mask.mask : mask);
		return this;
	}

	/**
	 * Adds a field to a filter. If the filter already matches, the method is a no-op.
	 *
	 * @method addField
	 * @param {String} path - the dotted path to the field to add
	 * @return {Object} - returns self
	 */
	addField(path) {
		if (!this.checkFields(objtools.setPath({}, path, true))) {
			objtools.setPath(this.mask, path, true);
		}
		return this;
	}

	/**
	 * Removes a field from a filter. If the mask already does not match, the method is a no-op.
	 *
	 * @method removeField
	 * @param {String} path - the dotted path to the field to remove
	 * @throws {XError} on attempt to remove wildcard
	 * @return {Object} - returns self
	 */
	removeField(path) {
		var submask, subpaths, nextSubpath, nextSubmask;
		if (path === '_' || path.slice(-2) === '._') {
			throw new XError(XError.INVALID_ARGUMENT, 'Attempt to remove wildcard');
		} else if (this.checkFields(objtools.setPath({}, path, true))) {
			submask = this.mask;
			subpaths = path.split('.');
			while (submask) {
				nextSubpath = subpaths.shift();
				nextSubmask = submask[nextSubpath];
				if (typeof nextSubmask === 'object') {
					submask = nextSubmask;
				} else if (submask._ && !nextSubmask) {
					submask = submask[nextSubpath] = _.cloneDeep(submask._);
				} else {
					while (subpaths.length) {
						submask = submask[nextSubpath] = { _: true };
						nextSubpath = subpaths.shift();
					}
					submask = submask[nextSubpath] = false;
				}
			}
		}
		return this;
	}

	/**
	 * Returns a copy of the given object, but only including the fields allowed by
	 * the mask. If the maskedOutHook function is provided, it is called for
	 * each field disallowed by the mask (at the highest level it is disallowed).
	 *
	 * @method filterObject
	 * @param {Object} obj - Object to filter
	 * @param {Function} [maskedOutHook] - Function to call for fields disallowed
	 * by the mask
	 * @param {String} maskedOutHook.path - Path on the object that was masked out
	 * @return {Object} - The object after removing masked out fields. Note that
	 * the returned object may still contain references to the original object.
	 * Fields that are not masked out are copied by reference.
	 */
	filterObject(obj, maskedOutHook) {
		return filterDeep(obj, this.mask, '', maskedOutHook);
	}

	/**
	 * Returns a subsection of a mask given a dot-separated path to the subsection.
	 *
	 * @method getSubMask
	 * @param {String} path - Dot-separated path to submask to fetch
	 * @return {ObjectMask} - Mask component corresponding to the path
	 */
	getSubMask(path) {
		var key, mask = this.mask, subpaths = path.split('.');
		while (subpaths.length && !objtools.isScalar(mask)) {
			key = subpaths.shift();
			mask = key in mask ? mask[key] : mask._;
		}
		return new ObjectMask(mask || false);
	}

	/**
	 * Returns true if the given path is allowed by the mask. false otherwise.
	 *
	 * @method checkMaskPath
	 * @param {String} path - Dot-separated path
	 * @return {Boolean} - Whether or not the given path is allowed
	 */
	checkPath(path) {
		return this.getSubMask(path).mask === true;
	}

	/**
	 * Make a deep copy of the mask.
	 *
	 * @method clone
	 * @return {ObjectMask}
	 */
	clone() {
		return new ObjectMask(objtools.deepCopy(this.mask));
	}

	/**
	 * Returns the internal object that represents this mask.
	 *
	 * @method toObject
	 * @return {Object} - Object representation of this mask
	 */
	toObject() {
		return this.mask;
	}

	/**
	 * Adds a set of masks together, but using a logical AND instead of a logical OR (as in addMasks).
	 * IE, a field must be allowed in all given masks to be in the result mask.
	 *
	 * @method andMasks
	 * @static
	 * @param {ObjectMask|Object} mask1
	 * @param {ObjectMask|Object} mask2...
	 * @return {ObjectMask} - The result of ANDing together the component masks
	 */
	static andMasks() {
		var resultMask = true;
		var curArg, argIdx;
		for (argIdx = 0; argIdx < arguments.length; argIdx++) {
			curArg = arguments[argIdx];
			if (ObjectMask.isObjectMask(curArg)) {
				curArg = curArg.toObject();
			}
			resultMask = andMask(resultMask, curArg);
			if (resultMask === false) return false;
		}
		return new ObjectMask(resultMask || false);
	}


	/**
	 * Check if a mask is valid in strict form (ie, it only contains objects and booleans)
	 *
	 * @method validate
	 * @return {Boolean} - Whether or not the mask is strictly valid
	 */
	validate() {
		return valWhitelist(this.mask);
	}

	/**
	 * Returns an array of fields in the given object which are restricted by the given mask
	 *
	 * @method getMaskedOutFields
	 * @param {Object} obj - The object to check against
	 * @return {String[]} - Paths to fields that are restricted by the mask
	 */
	getMaskedOutFields(obj) {
		var maskedOut = [];
		this.filterObject(obj, (path) => { maskedOut.push(path); });
		return maskedOut;
	}

	/**
	 * Given a dot-notation mapping from fields to values, remove all fields that are not
	 * allowed by the mask.
	 *
	 * @method filterDottedObject
	 * @param {Object} dottedObj - Map from dotted paths to values, such as { "foo.bar": "baz" }
	 * @param {Function} [maskedOutHook] - Function to call for removed fields
	 * @param {String} maskedOutHook.path - Path of the masked out field
	 * @return {Object} - The result
	 */
	filterDottedObject(dottedObj, maskedOutHook) {
		var resultObj = {};
		var key;
		for (key in dottedObj) {
			if (!this.checkPath(key)) {
				if (maskedOutHook) {
					maskedOutHook(key);
				}
			} else {
				resultObj[key] = dottedObj[key];
			}
		}
		return resultObj;
	}

	/**
	 * Returns an array of fields in the given object which are restricted by the given mask. The
	 * object is in dotted notation as in filterDottedObject()
	 *
	 * @method getDottedMaskedOutFields
	 * @param {Object} obj - The object to check against
	 * @return {String[]} - Paths to fields that are restricted by the mask
	 */
	getDottedMaskedOutFields(obj) {
		var maskedOut = [];
		this.filterDottedObject(obj, (path) => { maskedOut.push(path); });
		return maskedOut;
	}

	/**
	 * Given a structured document, ensures that
	 * all fields are allowed by the given mask. Returns true or false.
	 *
	 * @method checkFields
	 * @param {Object} obj
	 * @return {Boolean}
	 */
	checkFields(obj) {
		return this.getMaskedOutFields(obj).length === 0;
	}

	/**
	 * Given a dot-notation mapping from fields to values (only 1 level deep is checked),
	 * ensure that all fields are in the (structured) mask.
	 *
	 * @method checkDottedFields
	 * @param {Object} dottedObj - Mapping from dot-separated paths to values
	 * @return {Boolean}
	 */
	checkDottedFields(dottedObj) {
		return Object.keys(dottedObj).every((path) => this.checkPath(path));
	}

	/**
	 * Returns a function that filters object fields based on a structured mask/whitelist.
	 *
	 * @method createFilterFunc
	 * @static
	 * @return {Function} - A function(obj) that is the equivalent of calling filterObject()
	 * on obj
	 */
	createFilterFunc() {
		return (obj) => this.filterObject(obj);
	}
}

function underscorizeArrays(mask) {
	var subpath, submask;
	for (subpath in mask) {
		submask = mask[subpath];
		if (_.isArray(submask)) {
			mask[subpath] = { _: underscorizeArrays(submask[0]) };
		} else if (_.isObject(submask)) {
			mask[subpath] = underscorizeArrays(submask);
		}
	}
	return mask;
}

// shallowly removes falsey keys if obj does not have a wildcard
function sanitizeFalsies(obj) {
	var key;
	if (!obj._) {
		delete obj._;
		for (key in obj) {
			if (obj[key] === false) delete obj[key];
		}
	}
	return obj;
}

function invert(mask) {
	// base case:
	if (objtools.isScalar(mask)) return !mask;

	var key, result = {};
	for (key in mask) result[key] = invert(mask[key]);
	if (!('_' in result)) {
		result._ = true;
	} else if (!result._) {
		delete result._;
	}
	return result;
}

function subtract(a, b) {
	var key;
	// base cases:
	if (a === true) return invert(b);
	if (a === false) return false;
	if (!a) return invert(b);
	if (!b) return a;
	if (b === true || _.isEqual(a, b)) return false;

	if (objtools.isScalar(a) || objtools.isScalar(b)) {
		throw new XError(XError.INVALID_ARGUMENT, {
			message: 'Cannot subtract non-boolean scalars',
			data: { a: a, b: b }
		});
	}

	if ('_' in b) {
		for (key in a) {
			if (!(key in b) || key === '_') {
				a[key] = subtract(a[key], b._);
			}
		}
	}
	if ('_' in a && '_' in b) { // both have _
		for (key in b) {
			if (key !== '_') {
				a._[key] = subtract(a[key], b[key]);
			}
		}
	} else {
		for (key in b) {
			a[key] = subtract(a[key], b[key]);
		}
	}
	return sanitizeFalsies(a);
}

function filterDeep(obj, mask, path, maskedOutHook) {
	var resultIsArray, resultObj, key, maskVal, resultVal;
	if (mask === true) return obj;
	if (mask && !objtools.isScalar(obj) && !objtools.isScalar(mask)) {
		resultIsArray = _.isArray(obj);
		resultObj = resultIsArray ? [] : {};
		for (key in obj) {
			maskVal = (key in mask) ? mask[key] : mask._;
			resultVal = filterDeep(obj[key], maskVal || false, path ? (path + '.' + key) : key, maskedOutHook);
			if (resultVal !== undefined) {
				if (resultIsArray) resultObj.push(resultVal);
				else resultObj[key] = resultVal;
			}
		}
		return resultObj;
	} else if (maskedOutHook) {
		maskedOutHook(path);
	}
}

// Adds a single mask (fromMask) into the resultMask mask in-place. toMask should be an object.
// If the resulting mask is a boolean true, this function returns true. Otherwise, it returns toMask.
function addMask(resultMask, newMask) {
	// base cases
	if (resultMask === true || newMask === true) return true;
	if (objtools.isScalar(newMask)) return resultMask;
	if (objtools.isScalar(resultMask)) return objtools.deepCopy(newMask);

	var key;
	// If there are keys that exist in result but not in the newMask,
	// and the result mask has a _ key (wildcard), combine
	// the wildcard mask with the new mask, because in the existing
	// result mask, that key has the wildcard permissions
	if ('_' in newMask) {
		for (key in resultMask) {
			if (key !== '_' && !(key in newMask)) resultMask[key] = addMask(resultMask[key], newMask._);
		}
	}
	// same here ... also, copy over or merge fields
	for (key in newMask) {
		if (key !== '_') {
			if (key in resultMask) {
				resultMask[key] = addMask(resultMask[key], newMask[key]);
			} else if ('_' in resultMask) {
				resultMask[key] = addMask(objtools.deepCopy(newMask[key]), resultMask._);
			} else {
				resultMask[key] = objtools.deepCopy(newMask[key]);
			}
		}
	}
	// fill in the _ key that we skipped earlier
	if ('_' in newMask) {
		resultMask._ = ('_' in resultMask)
			? addMask(resultMask._, newMask._)
			: objtools.deepCopy(newMask._);
	}
	// If there is a wildcard, remove any keys that are set to the same thing as the wildcard
	// This isn't strictly necessary, but removes redundant data
	if ('_' in resultMask) {
		for (key in resultMask) {
			if (key !== '_' && objtools.deepEquals(resultMask[key], resultMask._)) {
				delete resultMask[key];
			}
		}
	}
	return resultMask || false;
}

function andMask(resultMask, newMask) {
	// base cases
	if (resultMask === true) return objtools.deepCopy(newMask);
	if (newMask === true) return resultMask;
	if (objtools.isScalar(resultMask) || objtools.isScalar(newMask)) return false;

	var key;
	// Handle keys that exist in both masks, excepting _
	for (key in newMask) {
		if (key !== '_' && key in resultMask) {
			resultMask[key] = andMask(resultMask[key], newMask[key]);
		}
	}
	// Handle keys that exist in resultMask but not in newMask
	for (key in resultMask) {
		if (key !== '_' && !(key in newMask)) {
			resultMask[key] = ('_' in newMask)
				? andMask(resultMask[key], newMask._)
				: false;
		}
	}
	// Handle keys that exist in newMask but not resultMask
	for (key in newMask) {
		if (key !== '_' && !(key in resultMask)) {
			resultMask[key] = ('_' in resultMask)
				? andMask(objtools.deepCopy(newMask[key]), resultMask._)
				: false;
		}
	}
	// Handle _ (wildcard fields)
	if ('_' in newMask && '_' in resultMask) {
		resultMask._ = andMask(resultMask._, newMask._);
	} else {
		delete resultMask._;
	}
	resultMask = sanitizeFalsies(resultMask);
	// If there are no keys left in resultMask, condense to false
	return Object.keys(resultMask).length ? resultMask : false;
}

function valWhitelist(whitelist) {
	var key;
	if (whitelist !== true && whitelist !== false && objtools.isScalar(whitelist)) return false;
	if (typeof whitelist === 'object') {
		for (key in whitelist) {
			if (!valWhitelist(whitelist[key])) return false;
		}
	}
	return true;
}

module.exports = ObjectMask;
