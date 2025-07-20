// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const expect = require('chai').expect;
const _ = require('lodash');
const objtools = require('../lib');

class TestClass {
	testMethod() {
		return true;
	}
}

describe('Base Functions', function() {
	describe('isScalar()', function() {
		it('should return true for scalar values', function() {
			expect(objtools.isScalar(true)).to.be.true;
			expect(objtools.isScalar(false)).to.be.true;
			expect(objtools.isScalar(new Date())).to.be.true;
			expect(objtools.isScalar(123)).to.be.true;
			expect(objtools.isScalar(null)).to.be.true;
			expect(objtools.isScalar(undefined)).to.be.true;
			expect(objtools.isScalar(function() {})).to.be.true;
		});
		it('should return false for non-scalar values', function() {
			expect(objtools.isScalar({})).to.be.false;
			expect(objtools.isScalar([])).to.be.false;
			expect(objtools.isScalar(new Error())).to.be.false;
		});
	});

	describe('scalarEquals', function() {
		const date1 = new Date('2014-01-01T00:00:00Z');
		const date2 = new Date('2014-01-01T00:00:00Z');
		const date3 = new Date('2014-01-01T00:00:01Z');
		const func = function() {};
		const obj = {};
		it('should handle dates', function() {
			expect(objtools.scalarEquals(date1, date2)).to.be.true;
			expect(objtools.scalarEquals(date2, date3)).to.be.false;
		});
		it('should handle other types', function() {
			expect(objtools.scalarEquals(2, 2)).to.be.true;
			expect(objtools.scalarEquals(true, true)).to.be.true;
			expect(objtools.scalarEquals(null, null)).to.be.true;
			expect(objtools.scalarEquals(undefined, undefined)).to.be.true;
			expect(objtools.scalarEquals(0, null)).to.be.false;
			expect(objtools.scalarEquals(obj, obj)).to.be.true;
			expect(objtools.scalarEquals(func, func)).to.be.true;
			expect(objtools.scalarEquals(obj, func)).to.be.false;
			expect(objtools.scalarEquals({}, {})).to.be.false;
		});
	});

	describe('deepEquals()', function() {
		const date1 = new Date('2014-01-01T00:00:00Z');
		const date2 = new Date('2014-01-01T00:00:00Z');
		const date3 = new Date('2014-01-01T00:00:01Z');
		const obj1 = { foo: { bar: 'baz', biz: [ 1, 2 ] } };
		const obj2 = { foo: { bar: 'baz', biz: [ 1, 2 ] } };
		const obj3 = { foo: { bar: 'biz' }, biz: [ 1, 2 ] };
		let obj4 = { foo: { bar: 'biz' }, biz: [ 1 ] };
		it('should handle dates correctly', function() {
			expect(objtools.deepEquals(date1, date2)).to.be.true;
			expect(objtools.deepEquals(date2, date3)).to.be.false;
			expect(objtools.deepEquals({ d: date1 }, { d: date2 })).to.be.true;
		});
		it('should handle objects correctly', function() {
			expect(objtools.deepEquals(obj1, obj2)).to.be.true;
			expect(objtools.deepEquals(obj2, obj3)).to.be.false;
			expect(objtools.deepEquals(obj3, obj4)).to.be.false;
		});
		it('should not coerce types', function() {
			expect(objtools.deepEquals({ a: null }, { a: null })).to.be.true;
			expect(objtools.deepEquals({ a: undefined }, { a: undefined })).to.be.true;
			expect(objtools.deepEquals({ a: null }, { a: undefined })).to.be.false;
			expect(objtools.deepEquals({ a: 0 }, { a: null })).to.be.false;
		});
	});

	describe('deepCopy()', function() {
		const obj1 = {
			foo: 'bar',
			fuzz: 123,
			biz: { dat: new Date('2014-01-01T00:00:00Z'), n: null, u: undefined },
			arr: [ 1, 2 ]
		};
		const obj2 = {
			foo: new TestClass()
		};
		it('should correctly copy objects', function() {
			const copy = objtools.deepCopy(obj1);
			expect(copy).to.deep.equal(obj1);
			expect(null).to.not.deep.equal(undefined);	// make sure chai does what we want it to
		});
		it('should not maintain references to objects', function() {
			const copy = objtools.deepCopy(obj1);
			expect(copy).to.deep.equal(obj1);
			copy.biz.dat = 123;
			expect(copy).to.not.deep.equal(obj1);
		});
		it('should copy non-primitive objects', function() {
			const copy = objtools.deepCopy(obj2);
			expect(copy.foo).to.equal(obj2.foo);
		});
	});

	describe('collapseToDotted()', function() {
		const obj1 = {
			foo: 123,
			bar: { biz: 12, baz: { buz: 1 } },
			arr: [ 1, 2, { foo: 3 } ]
		};
		it('should correctly collapse objects to dotted form', function() {
			const dotted = objtools.collapseToDotted(obj1);
			expect(dotted).to.deep.equal({
				'foo': 123,
				'bar.biz': 12,
				'bar.baz.buz': 1,
				'arr.0': 1,
				'arr.1': 2,
				'arr.2.foo': 3
			});
		});
		it('should obey includeRedundantLevels', function() {
			const dotted = objtools.collapseToDotted(obj1, true);
			expect(dotted).to.deep.equal({
				'foo': 123,
				'bar': obj1.bar,
				'bar.biz': 12,
				'bar.baz': obj1.bar.baz,
				'bar.baz.buz': 1,
				'arr': obj1.arr,
				'arr.0': 1,
				'arr.1': 2,
				'arr.2.foo': 3,
				'arr.2': obj1.arr[2]
			});
			// check for referential equality
			expect(dotted.bar).to.equal(obj1.bar);
			expect(dotted.bar.baz).to.equal(obj1.bar.baz);
		});
		it('should obey stopAtArrays', function() {
			const dotted = objtools.collapseToDotted(obj1, false, true);
			expect(dotted).to.deep.equal({
				'foo': 123,
				'bar.biz': 12,
				'bar.baz.buz': 1,
				'arr': obj1.arr
			});
			expect(dotted.arr).to.equal(obj1.arr);
		});
	});

	describe('matchObject()', function() {
		// it's not like an ObjectMask
		const obj = { foo: 'foo', bar: { biz: 12 }, zip: [ 4, 5 ] };
		it('returns true if it matches', function() {
			expect(objtools.matchObject(obj, { foo: 'foo' })).to.be.true;
			expect(objtools.matchObject(obj, { bar: { biz: 12 } })).to.be.true;
			expect(objtools.matchObject(obj, { zip: [ 4 ] })).to.be.true;
		});
		it('returns false if it doesnt match', function() {
			expect(objtools.matchObject(obj, { foo: true })).to.be.false;
			expect(objtools.matchObject(obj, { bar: { _: 12 } })).to.be.false;
			expect(objtools.matchObject(obj, { zip: [ 4, 5, 6 ] })).to.be.false;
		});
	});

	describe('matchDottedObject()', function() {
		const obj = { foo: 'foo', bar: { biz: 12 }, zip: [ 4, 5 ] };
		const dotted1 = { 'foo': 'foo', 'bar': { biz: 12 }, 'zip': [ 4, 5 ] };
		const dotted2 = { 'foo': 'foo', 'bar': { biz: 12 }, 'zip': [ 4, 2 ] };
		it('returns true if it matches', function() {
			expect(objtools.matchDottedObject(obj, dotted1)).to.be.true;
		});
		it('returns false if it doesnt match', function() {
			expect(objtools.matchDottedObject(obj, dotted2)).to.be.false;
		});
	});

	describe('syncObject()', function() {
		const fromObj = {
			foo: 'bar',
			baz: { qux: [
				{ zip: 'zap', bam: new Date('2014-01-01T00:00:00Z') },
				{ bip: 'boop' }
			] },
			foop: { flap: 'flip' },
			qax: new Date('2014-01-02T00:00:00Z')
		};
		it('should copy an object to the destination', function() {
			let toObj = {
				foo: 'bip',
				zap: 'zip',
				qux: { boom: 123 },
				foop: { flap: 'flop' },
				qax: new Date('2014-01-01T00:00:00Z')
			};
			const origFoop = toObj.foop;
			const expected = objtools.deepCopy(fromObj);
			objtools.syncObject(toObj, fromObj);
			expect(toObj).to.deep.equal(fromObj);
			// make sure it didn't modify fromObj
			expect(fromObj).to.deep.equal(expected);
			// make sure it didn't change the internal object reference
			expect(toObj.foop).to.equal(origFoop);
		});
		it('should skip fields when the onField hook returns false', function() {
			let toObj = {
				foo: 'bip',
				zap: 'zip',
				baz: { qux: 123 },
				qux: { boom: 123 },
				foop: { flap: 'flop' }
			};
			objtools.syncObject(toObj, fromObj, { onField: (field) => field !== 'baz.qux' });
			expect(toObj).to.deep.equal({
				foo: 'bar',
				baz: { qux: 123 },
				foop: { flap: 'flip' },
				qax: new Date('2014-01-02T00:00:00Z')
			});
		});
		it('should call onChange for changed fields', function() {
			let toObj = {
				foo: 'bip',
				zoop: 'zip',
				baz: { qux: 123 },
				qux: { boom: 123 },
				foop: { flap: 'flop' },
				zap: 4
			};
			let changed = [];
			objtools.syncObject(toObj, fromObj, { onChange: (field) => changed.push(field) });
			const expected = [ 'foo', 'zoop', 'baz.qux', 'qax', 'qux', 'foop.flap', 'zap' ];
			expect(toObj).to.deep.equal(fromObj);
			expect(changed.sort()).to.deep.equal(expected.sort());
		});
		it('should work with arrays and nested arrays', function() {
			let fromArrObj = {
				a: [ [ 1, 2, 3 ], [ 44 ] ],
				b: [ 1, 2, 3, 4, 5 ],
				c: [ 10 ],
				d: [ { stuff: 'good', bar: 'foo' } ]
			};
			let toArrObj = {
				a: [ [ 11, 2, 3, 4 ], [ 44 ], [ 55 ] ],
				b: [ 1, 2, 3 ],
				c: [ 10, 11 ],
				d: [ { stuff: 'just ok', foo: 'bar' } ]
			};
			objtools.syncObject(toArrObj, fromArrObj);
			expect(toArrObj).to.deep.equal({
				a: [ [ 1, 2, 3 ], [ 44 ] ],
				b: [ 1, 2, 3, 4, 5 ],
				c: [ 10 ],
				d: [ { stuff: 'good', bar: 'foo' } ]
			});
		});
	});

	describe('path functions', function() {
		let obj1 = {
			foo: 'bar',
			baz: {
				biz: 'buz',
				arr: [ 1, 2, { zip: 3 } ],
				arr2: [ { zip: 4 } ]
			}
		};
		it('getPath should fetch basic object paths', function() {
			expect(objtools.getPath(obj1, 'foo')).equals(obj1.foo);
			expect(objtools.getPath(obj1, 'baz')).equals(obj1.baz);
			expect(objtools.getPath(obj1, 'baz.biz')).equals(obj1.baz.biz);
			expect(objtools.getPath(obj1, 'baz.arr2.zip')).equals(undefined);
			expect(objtools.getPath(obj1, 'baz.arr.1')).equals(2);
			expect(objtools.getPath(obj1, 'baz.arr.2.zip')).equals(3);
		});
		it('getPath should obey allowSkipArrays', function() {
			expect(objtools.getPath(obj1, 'foo', true)).equals(obj1.foo);
			expect(objtools.getPath(obj1, 'baz', true)).equals(obj1.baz);
			expect(objtools.getPath(obj1, 'baz.biz', true)).equals(obj1.baz.biz);
			expect(objtools.getPath(obj1, 'baz.arr2.zip', true)).equals(4);
			expect(objtools.getPath(obj1, 'baz.arr.1', true)).equals(2);
			expect(objtools.getPath(obj1, 'baz.arr.2.zip', true)).equals(3);
		});
		it('getPath should handle root path', function() {
			expect(objtools.getPath(obj1, null)).to.deep.equal(obj1);
		});
		it('setPath should set various paths', function() {
			objtools.setPath(obj1, 'foo', 'biz');
			expect(obj1.foo).to.equal('biz');
			objtools.setPath(obj1, 'baz.arr.1', 8);
			expect(obj1.baz.arr[1]).to.equal(8);
		});
		it('setPath should create parent objects as necessary', function() {
			objtools.setPath(obj1, 'bar.biz.baz.buz', 10);
			expect(obj1.bar).to.deep.equal({ biz: { baz: { buz: 10 } } });
		});
		it('setPath should overwrite parent object on conflicting type', function() {
			objtools.setPath(obj1, 'baz.arr.1.buz', 11);
			expect(obj1.baz.arr[1]).to.deep.equal({ buz: 11 });
		});
		it('deletePath should delete paths', function() {
			objtools.deletePath(obj1, 'baz.arr');
			expect(obj1.baz.arr).to.equal(undefined);
		});
	});

	describe('merge()', function() {
		const falsey = [ '', 0, false, NaN, null, undefined ];
		it('should pass thru falsey `object` values', function() {
			const actual = _.map(falsey, value => objtools.merge(value));
			expect(actual).to.deep.equal(falsey);
		});
		it('should not error when `object` is nullish and source objects are provided', function() {
			expect(objtools.merge(null, { a: 1 })).to.deep.equal({ a: 1 });
			expect(objtools.merge(undefined, { a: 1 })).to.deep.equal({ a: 1 });
		});
		it('should work as an iteratee for methods like `_.reduce`', function() {
			let array = [ { 'a': 1 }, { 'b': 2 }, { 'c': 3 } ];
			let expected = { 'a': 1, 'b': 2, 'c': 3 };
			let actual = _.reduce(array, objtools.merge, { 'a': 0 });
			expect(actual).to.deep.equal(expected);
		});
		it('should provide the correct `customizer` arguments', function() {
			let object = { 'a': 1 };
			let source = { 'a': 2 };
			let args, expected = [ 1, 2, 'a', _.cloneDeep(object), _.cloneDeep(source) ];
			objtools.merge(_.cloneDeep(object), _.cloneDeep(source), function() {
				args = _.toArray(_.cloneDeep(arguments));
			});
			expect(args).to.deep.equal(expected, 'primitive property values');
			args = null;
			object = { 'a': 1 };
			source = { 'b': 2 };
			expected = [ undefined, 2, 'b', object, source ];
			objtools.merge(_.cloneDeep(object), _.cloneDeep(source), function() {
				args = _.toArray(_.cloneDeep(arguments));
			});
			expect(args).to.deep.equal(expected, 'missing destination property');
			args = [];
			let objectValue = [ 1, 2 ];
			let sourceValue = { 'b': 2 };
			object = { 'a': objectValue };
			source = { 'a': sourceValue };
			expected = [
				[ objectValue, sourceValue, 'a', object, source ],
				// note: this differs from the lodash test bc that test is wrong
				[ undefined, 2, 'b', objectValue, sourceValue ]
			];
			objtools.merge(_.cloneDeep(object), _.cloneDeep(source), function() {
				args.push(_.toArray(_.cloneDeep(arguments)));
			});
			expect(args).to.deep.equal(expected, 'non-primitive property values');
		});
		it('should not assign the `customizer` result if it is the same as the destination value', function() {
			_.each([ 'a', [ 'a' ], { 'a': 1 }, NaN ], function(value) {
				let object = {};
				let pass = true;
				Object.defineProperty(object, 'a', {
					'get': _.constant(value),
					'set': function() { pass = false; }
				});
				objtools.merge(object, { 'a': value }, _.identity);
				expect(pass).to.be.true;
			});
		});
		it('should merge `source` into the destination object', function() {
			const names = { 'characters': [ { 'name': 'barney' }, { 'name': 'fred' } ] };
			const ages = { 'characters': [ { 'age': 36 }, { 'age': 40 } ] };
			const heights = { 'characters': [ { 'height': '5\'4"' }, { 'height': '5\'5"' } ] };
			const expected = { 'characters': [
				{ 'name': 'barney', 'age': 36, 'height': '5\'4"' },
				{ 'name': 'fred', 'age': 40, 'height': '5\'5"' }
			] };
			expect(objtools.merge(names, ages, heights)).to.deep.equal(expected);
		});
		it('should work with four arguments', function() {
			const expected = { 'a': 4 };
			const actual = objtools.merge({ 'a': 1 }, { 'a': 2 }, { 'a': 3 }, expected);
			expect(actual).to.deep.equal(expected);
		});
		it('should assign `null` values', function() {
			const actual = objtools.merge({ 'a': 1 }, { 'a': null });
			expect(actual.a).to.equal(null);
		});
		it('should not assign `undefined` values', function() {
			const actual = objtools.merge({ 'a': 1 }, { 'a': undefined, 'b': undefined });
			expect(actual).to.deep.equal({ 'a': 1 });
		});
		it('should work with a function `object` value', function() {
			function Foo() {}
			const source = { 'a': 1 };
			expect(objtools.merge(Foo, source)=== Foo);
			expect(Foo.a === 1);
		});
		it('should override primitive `object` values', function() {
			const values = [ true, 1, '1' ];
			const actual = _.map(values, value => objtools.merge(value, { 'a': 1 }));
			expect(actual).to.deep.equal([ { a: 1 }, { a: 1 }, { a: 1 } ]);
		});
		it('should handle merging if `customizer` returns `undefined`', function() {
			const actual = objtools.merge({ 'a': { 'b': [ 1, 1 ] } }, { 'a': { 'b': [ 0 ] } }, _.noop);
			expect(actual).to.deep.equal({ 'a': { 'b': [ 0, 1 ] } });
			expect(objtools.merge([], [ undefined ], _.identity)).to.deep.equal([ undefined ]);
		});
		it('should defer to `customizer` when it returns a value other than `undefined`', function() {
			const customizer = (a, b) => (_.isArray(a) ? a.concat(b) : undefined);
			const actual = objtools.merge({ 'a': { 'b': [ 0, 1 ] } }, { 'a': { 'b': [ 2 ] } }, customizer);
			expect(actual).to.deep.equal({ 'a': { 'b': [ 0, 1, 2 ] } });
		});
		it('handles deep heterogeneous types', function() {
			let obj = { a: {
				b: [ 'c' ],
				d: 'e',
				f: { g: 'h' },
				i: 'jk',
				l: [ 'o', 'l' ]
			} };
			const source = { a: {
				b: 'c',
				d: [ 'e' ],
				f: 'gh',
				i: { j: 'k' },
				l: { o: 'l' }
			} };
			const expected = { a: {
				b: 'c',
				d: [ 'e' ],
				f: 'gh',
				i: { j: 'k' },
				l: _.extend([ 'o', 'l' ], { o: 'l' })
			} };
			expect(objtools.merge(obj, source)).to.deep.equal(expected);
		});
		it('copies constructors', function() {
			let obj = {
				foo: String
			};
			let result = objtools.merge({}, obj);
			expect(result.foo).to.equal(String);
		});
		it('copies non-plain objects', function() {
			function TestClass() {}
			let obj = {
				foo: new TestClass()
			};
			let result = objtools.merge({}, obj);
			expect(result.foo).to.equal(obj.foo);
		});
	});

	describe('getDuplicates()', function() {
		const arr = [ 'a', 'b', 'a', 'c', 'c' ];
		it('gets the duplicates in an array of strings', function() {
			const result = objtools.getDuplicates(arr);
			const expected = [ 'a', 'c' ];
			expect(result).to.contain.members(expected);
			expect(result.length).to.equal(expected.length);
		});
	});

	describe('diffObjects()', function() {
		const a = {
			a: 'b', // value the same in all objects
			c: 'd', // value exists in all objects with different values
			e: 'f', // value only exists in some objects
			g: 'h', // value is a scalar in some objects and non-scalar in others
			i: { j: 'k' }, // value is a collection with non-overlapping fields across objects
			l: { m: 'n', o: { p: 'q' } } // value is a collection with some overlapping fields across objects
		};
		const b = {
			a: 'b',
			c: 1,
			e: 'f',
			g: { h: true },
			i: { k: 'j' },
			l: { m: 'nop' }
		};
		const c = {
			a: 'b',
			c: false,
			i: { jk: true },
			l: { m: 'no', p: 'q' }
		};
		const aScalar = 'scalar';
		it('diffs two objects', function() {
			const result = objtools.diffObjects(a, b);
			const expected = {
				c: [ 'd', 1 ],
				g: [ 'h', { h: true } ],
				i: [ { j: 'k' }, { k: 'j' } ],
				l: {
					m: [ 'n', 'nop' ],
					o: [ { p: 'q' }, null ]
				}
			};
			expect(result).to.deep.equal(expected);
		});
		it('diffs n objects', function() {
			const result = objtools.diffObjects(a, b, c);
			const expected = {
				c: [ 'd', 1, false ],
				e: [ 'f', 'f', null ],
				g: [ 'h', { h: true }, null ],
				i: [ { j: 'k' }, { k: 'j' }, { jk: true } ],
				l: {
					m: [ 'n', 'nop', 'no' ],
					o: [ { p: 'q' }, null, null ],
					p: [ null, null, 'q' ]
				}
			};
			expect(result).to.deep.equal(expected);
		});
		it('handles scalars', function() {
			const result = objtools.diffObjects(a, b, aScalar);
			const expected = _.extend([ null, null, aScalar ], {
				a: [ 'b', 'b', null ],
				c: [ 'd', 1, null ],
				e: [ 'f', 'f', null ],
				g: [ 'h', { h: true }, null ],
				i: [ { j: 'k' }, { k: 'j' }, null ],
				l: {
					m: [ 'n', 'nop', null ],
					o: [ { p: 'q' }, null, null ]
				}
			});
			expect(result).to.deep.equal(expected);
		});
	});

	describe('dottedDiff()', function() {
		const obj1 = {
			a: { b: 'c', d: { e: 'f' } },
			d: 'efg'
		};
		const obj2 = {
			a: { b: 'c', d: true },
			d: new Date('2015-01-01'),
			f: 'g'
		};
		const aScalar = 'scalar';
		const anotherScalar = new Date('2015-01-01');
		const arr1 = [ obj1.a, obj2.a, aScalar ];
		const arr2 = [ obj1.d, obj2.d, aScalar ];
		it('diffs two objects', function() {
			const result = objtools.dottedDiff(obj1, obj2);
			const expected = [ 'a.d', 'd', 'f' ];
			expect(result).to.contain.members(expected);
			expect(result.length).to.equal(expected.length);
		});
		it('diffs two arrays', function() {
			const result = objtools.dottedDiff(arr1, arr2);
			const expected = [ '0', '1' ];
			expect(result).to.contain.members(expected);
			expect(result.length).to.equal(expected.length);
		});
		it('diffs an object and an array', function() {
			const result = objtools.dottedDiff(obj1, arr1);
			const expected = _.union(_.keys(obj1), _.keys(arr1));
			expect(result).to.contain.members(expected);
			expect(result.length).to.equal(expected.length);
		});
		it('diffs an object and a scalar', function() {
			const result = objtools.dottedDiff(obj1, aScalar);
			const expected = [ '' ];
			expect(result).to.contain.members(expected);
			expect(result.length).to.equal(expected.length);
		});
		it('diffs a scalar and an object', function() {
			const result = objtools.dottedDiff(aScalar, obj1);
			const expected = [ '' ];
			expect(result).to.contain.members(expected);
			expect(result.length).to.equal(expected.length);
		});
		it('handles dates', function() {
			const diffDates = objtools.dottedDiff({ foo: new Date() }, { foo: new Date(0) });
			const sameDates = objtools.dottedDiff({ foo: new Date(0) }, { foo: new Date(0) });
			expect(diffDates).to.deep.equal([ 'foo' ]);
			expect(sameDates).to.deep.equal([]);
		});
		it('diffs two scalars', function() {
			expect(objtools.dottedDiff(aScalar, anotherScalar)).to.equal('');
		});
		it('handles deep equal values', function() {
			expect(objtools.dottedDiff(obj1, _.cloneDeep(obj1))).to.deep.equal([]);
			expect(objtools.dottedDiff(aScalar, aScalar)).to.deep.equal([]);
		});
	});

	describe('objectHash()', function() {
		const obj1a = {
			a: 1,
			b: '2',
			c: [ 'xyz', null, null ],
			d: {
				asdf: 'jkl;'
			}
		};
		const obj1b = {
			b: '2',
			c: [ 'xyz', null, null ],
			d: {
				asdf: 'jkl;'
			},
			a: 1
		};
		const obj2a = {
			b: '2',
			c: [ null, 'xyz', null ],
			d: {
				asdf: 'jkl;'
			},
			a: 1
		};
		const prim1 = 12345;
		const prim2 = false;
		it('returns a hash', function() {
			let hash = objtools.objectHash(obj1a);
			expect(hash).to.be.a('string');
		});
		it('hashes primitives', function() {
			let hash1 = objtools.objectHash(prim1);
			expect(hash1).to.be.a('string');
			let hash2 = objtools.objectHash(prim2);
			expect(hash2).to.be.a('string');
		});
		it('hashes are consistent', function() {
			let hash1 = objtools.objectHash(obj1a);
			let hash2 = objtools.objectHash(obj1b);
			expect(hash1).to.equal(hash2);
		});
		it('hashes for different objects do not conflict', function() {
			let hash1 = objtools.objectHash(obj1a);
			let hash2 = objtools.objectHash(obj1b);
			let hash3 = objtools.objectHash(obj2a);
			expect(hash1).to.not.equal(hash3);
			expect(hash2).to.not.equal(hash3);
		});
	});

	describe('sanitizeDate()', function() {
		it('should convert a number of miliseconds to a Date instance', () => {
			let date = Date.now();
			let sanitized = objtools.sanitizeDate(date);
			expect(sanitized).to.be.an.instanceof(Date);
			expect(sanitized.getTime()).to.equal(date);
		});

		it('should concert a date string to a Date instance', () => {
			let date = new Date();
			let sanitized = objtools.sanitizeDate(date.toISOString());
			expect(sanitized).to.be.an.instanceof(Date);
			expect(sanitized.getTime()).to.equal(date.getTime());
		});

		it('should return the same object if a date instance is passed in', () => {
			let date = new Date();
			let sanitized = objtools.sanitizeDate(date);
			expect(sanitized).to.be.an.instanceof(Date);
			expect(sanitized).to.deep.equal(date);
		});

		it('should flatten object with a field `date`', () => {
			let date = { date: new Date() };
			let sanitized = objtools.sanitizeDate(date);
			expect(sanitized).to.be.an.instanceof(Date);
			expect(sanitized).to.deep.equal(date.date);
		});
	});

	describe('isPlainObject()', function() {
		function TestConstructor() {}
		const values = {
			emptyObject: {},
			'null': null,
			plainObject: { foo: 'bar' },
			'function': function() {},
			nativeFunction: String,
			date: new Date(),
			'undefined': undefined,
			'false': false,
			string: 'foo',
			'true': true,
			classObject: new TestConstructor(),
			objectCreate: Object.create(null),
			array: [],
			jsonDecoded: JSON.parse('{"foo":"bar"}')
		};

		_.forEach(values, function(value, key) {
			it('should handle ' + key, function() {
				expect(objtools.isPlainObject(value)).to.equal(_.isPlainObject(value));
			});
		});
	});

	describe('isEmpty()', function() {
		const values = {
			emptyObject: {},
			'null': null,
			plainObject: { foo: 'bar' },
			'function': function() {},
			date: new Date(),
			'undefined': undefined,
			string: 'foo',
			emptyString: '',
			array: [ 'foo' ],
			emptyArray: [],
			jsonDecoded: JSON.parse('{"foo":"bar"}')
		};

		_.forEach(values, function(value, key) {
			it('should handle ' + key, function() {
				expect(objtools.isEmpty(value)).to.equal(_.isEmpty(value));
			});
		});
	});
});
