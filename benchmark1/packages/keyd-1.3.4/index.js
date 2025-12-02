'use strict';

function KeyPath(obj) {

	if (!(this instanceof KeyPath)) return new KeyPath(obj);

	Object.defineProperty(this, 'result', {
		get: function() {
			return obj;
		}
	});

	this.keyPaths = function(options = {}) {

		if (typeof options.depth !== 'number') options.depth = Infinity;
		options.separator = options.separator || '.';

		const keys = (obj, keyPath = [], level = 0) => {
			if (level > options.depth) return [];
			if (level > 0 && options.tester && !options.tester(join(keyPath, options), obj)) return [];
			if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
			return [].concat(...Object.keys(obj).map((key) => {
				const newKeyPath = keyPath.concat([key]);
				return [join(newKeyPath, options)].concat(...keys(obj[key], newKeyPath, level + 1));
			}));
		};

		return keys(obj);

	};

	this.get = function(keyPath, options = { separator: '.' }) {
		return _unfold(keyPath, options)
			.reduce((obj, key) => {
				return (obj || {})[key];
			}, obj);
	};

	this.get.all = function(keyPath, options = { separator: '.' }) {

		const resolve = function(obj, keyPath) {

			if (keyPath.length == 0) return obj;

			if (!Array.isArray(obj)) obj = [obj];

			let items = obj.map((obj) => {
				let ret = obj[keyPath[0]];
				if (!Array.isArray(ret)) ret = [ret];
				return ret;
			}).reduce((res, item) => {
				return res.concat(item);
			}, []);

			return resolve(items, keyPath.slice(1));

		};

		return resolve(obj, _unfold(keyPath, options));

	};

	// Legacy binding.
	this.getAll = this.get.all;

	this.set = function(keyPath, value, options = { separator: '.' }) {

		keyPath = _unfold(keyPath, options.separator);

		let ret = obj;

		for (let idx = 0 ; idx < keyPath.length - 1 ; idx++) {
			ret = ret[keyPath[idx]] = ret[keyPath[idx]] || {};
		}

		if (keyPath.length > 0) ret[keyPath[keyPath.length - 1]] = value;

		return this;

	};

}

module.exports = exports = KeyPath;

function components(keyPath, options = {}) {
	if (typeof keyPath !== 'string') throw new Error('`keyPath` must be a string.');
	return (keyPath || '').split(options.separator || '.').filter((part) => part);
}

exports.components = components;

function _unfold(keyPath, options) {
	// If key path is not an array - we get the components of it.
	if (!Array.isArray(keyPath)) return components(keyPath, options);
	// - otherwise we copy it.
	return keyPath.slice();
}

function join(components, options = {}) {
	if (!Array.isArray(components)) throw new Error('`components` must be an array.');
	return _unfold(components || []).join(options.separator || '.');
}

exports.join = join;

function depth(keyPath, options = { separator: '.' }) {
	return _unfold(keyPath, options).length;
}

exports.depth = depth;

function append(keyPath, keys, options = { separator: '.' }) {
	return join(_unfold(keyPath, options).concat(_unfold(keys, options)), options);
}

exports.append = append;

function last(keyPath, options = { separator: '.' }) {
	let parts = _unfold(keyPath, options);
	return parts[parts.length - 1];
}

exports.last = last;

function eatLast(keyPath, options = { separator: '.' }) {
	return join(_unfold(keyPath, options).slice(0, -1), options);
}

exports.eatLast = eatLast;

function first(keyPath, options = { separator: '.' }) {
	return _unfold(keyPath, options)[0];
}

exports.first = first;

function eatFirst(keyPath, eat, options = { separator: '.' }) {

	if (typeof eat === 'object') {
		options = eat;
		eat = undefined;
	}

	// If components are not provided, we just take the first value.
	if (!eat) eat = first(keyPath, options);

	keyPath = _unfold(keyPath, options);
	eat = _unfold(eat, options);

	if (!within(eat, keyPath, options)) {
		throw new Error('`eat` is not with key path.');
	}

	// As long as there are components left that match we eat it.
	while (eat.length > 0) {
		if (keyPath[0] === eat[0]) {
			keyPath = keyPath.slice(1);
			eat = eat.slice(1);
		} else {
			break;
		}
	}
	
	return join(keyPath, options);

}

exports.eatFirst = eatFirst;

function within(first, second, options = { separator: '.' }) {

	first = _unfold(first, options);
	second = _unfold(second, options);

	if (first.length > second.length) return false;
	return !first.some((component, idx) => {
		return component !== second[idx];
	});

}

exports.within = within;
