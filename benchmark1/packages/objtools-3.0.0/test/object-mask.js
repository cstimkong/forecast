// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

let { expect } = require('chai');
let XError = require('xerror');
let _ = require('lodash');

let objtools = require('../lib');
let ObjectMask = objtools.ObjectMask;

describe('ObjectMask', function() {

	describe('new ObjectMask()', function() {
		it('underscorizes wildcard arrays', function() {
			let orig = new ObjectMask({ foo: [ { baz: true } ] });
			let expectedMask = { foo: { _: { baz: true } } };
			expect(orig.mask).to.deep.equal(expectedMask);
		});
	});

	describe('isObjectMask()', function() {
		it('returns true for ObjectMasks', function() {
			expect(ObjectMask.isObjectMask(new ObjectMask())).to.be.true;
		});
		it('returns false for non-ObjectMasks', function() {
			expect(ObjectMask.isObjectMask({ mask: {}, isObjectMask: true })).to.be.false;
		});
	});

	describe('addMasks()', function() {
		const mask1 = ({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		const mask2 = new ObjectMask({
			str1: true,
			num2: true,
			nul2: true,
			obj: { _: true, foo: false },
			arr: [ { str2: true } ]
		});
		const result = ObjectMask.addMasks(mask1, mask2);
		it('makes a mask that matches what either mask matches', function() {
			const expected = {
				str1: true,
				str2: true,
				num1: true,
				num2: true,
				nul1: true,
				nul2: true,
				obj: { _: true },
				arr: { _: { str1: true, str2: true } }
			};
			expect(result.checkFields(expected)).to.be.true;
		});
	});

	describe('subtractMasks()', function() {
		const subtract = (a, b) => ObjectMask.subtractMasks(a, b).mask;

		const minuend = new ObjectMask({
			str1: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { _: true, baz: false },
			obj1: { foo: true, bar: true },
			obj3: { foo: { foo: true, bar: true } },
			obj4: { _: true }
		});
		const subtrahend = new ObjectMask({
			str1: true,
			num2: true,
			nul2: true,
			obj: { quux: true },
			obj1: { _: true, foo: false },
			obj3: { _: { bar: false }, foo: { bar: true } },
			obj4: { _: true }
		});
		const difference = ObjectMask.subtractMasks(minuend, subtrahend);

		it('subtracts a mask', function() {
			const expected = {
				num1: true,
				nul1: true,
				obj: { _: true, baz: false, quux: false },
				obj1: { foo: true },
				obj3: { _: { _: true, bar: true }, foo: { foo: true } }
			};
			expect(difference.toObject()).to.deep.equal(expected);
		});
		it('subtracts primitive masks', function() {
			expect(subtract(true, true)).to.equal(false);
			expect(subtract(true, false)).to.equal(true);
			expect(subtract(false, true)).to.equal(false);
			expect(subtract(false, false)).to.equal(false);
		});
		it('returns false when subtracting a scalar from false', function() {
			expect(subtract(false, { _: true, foo: false })).to.equal(false);
		});
		it('no longer matches what the subtrahend matches', function() {
			const obj = {
				str1: 0,
				nul2: 2,
				obj: { quux: 3 },
				obj1: { bar: 4 },
				obj3: { foo: { bar: 6 } }
			};
			const filtered = { obj: {}, obj1: {}, obj3: { foo: {} } };
			expect(subtrahend.filterObject(obj)).to.deep.equal(obj, 'subtrahend doesnt match obj');
			expect(minuend.filterObject(obj)).to.deep.equal(obj, 'minuend doesnt match obj');
			expect(difference.filterObject(obj)).to.deep.equal(filtered, 'difference matches obj');
		});
		it('still matches what the subtrahend did not match', function() {
			const obj = {
				num1: 0,
				nul1: 1,
				obj: { foo: 2 },
				obj1: { foo: 3 },
				obj3: { foo: { foo: 5 } }
			};
			const filtered = { obj: {}, obj1: {}, obj3: { foo: {} } };
			expect(subtrahend.filterObject(obj)).to.deep.equal(filtered, 'subtrahend matches obj');
			expect(minuend.filterObject(obj)).to.deep.equal(obj, 'minuend doesnt match obj');
			expect(difference.filterObject(obj)).to.deep.equal(obj, 'difference doesnt match obj');
		});
		it('still doesnt match what the minuend did not match', function() {
			const obj = { foo: 0, baz: { quux: 1 } };
			expect(minuend.filterObject(obj)).to.deep.equal({});
			expect(difference.filterObject(obj)).to.deep.equal({});
		});
		it('throws on attempt to subtract with scalars', function() {
			expect(() => ObjectMask.subtractMasks(3, { _: { foo: true } })).to.throw(XError);
			expect(() => ObjectMask.subtractMasks({ _: { foo: true } }, 3)).to.throw(XError);
		});
	});

	describe('andMasks()', function() {
		const mask1 = new ObjectMask({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		const mask2 = new ObjectMask({
			str1: true,
			num2: true,
			nul2: true,
			obj: { _: true, foo: false },
			arr: [ { str2: true } ]
		});
		it('makes a mask that matches all fields that both masks match', function() {
			const result = ObjectMask.andMasks(mask1, mask2);
			const expected = {
				str1: true,
				nul2: true,
				obj: { bar: true }
			};
			expect(result.checkFields(expected)).to.be.true;
		});
	});

	describe('#subtractMask()', function() {
		const minuend = new ObjectMask({
			str1: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { _: true, baz: false },
			obj1: { foo: true, bar: true },
			obj3: { foo: { foo: true, bar: true } },
			obj4: { _: true }
		});
		const subtrahend = new ObjectMask({
			str1: true,
			num2: true,
			nul2: true,
			obj: { quux: true },
			obj1: { _: true, foo: false },
			obj3: { _: { bar: false }, foo: { bar: true } },
			obj4: { _: true }
		});
		const difference = new ObjectMask(minuend.mask).subtractMask(subtrahend);
		it('subtracts a mask', function() {
			const expected = {
				num1: true,
				nul1: true,
				obj: { _: true, baz: false, quux: false },
				obj1: { foo: true },
				obj3: { _: { _: true, bar: true }, foo: { foo: true } }
			};
			expect(difference.toObject()).to.deep.equal(expected);
		});
		it('no longer matches what the subtrahend matches', function() {
			const obj = {
				str1: 0,
				nul2: 2,
				obj: { quux: 3 },
				obj1: { bar: 4 },
				obj3: { foo: { bar: 6 } }
			};
			const filtered = { obj: {}, obj1: {}, obj3: { foo: {} } };
			expect(subtrahend.filterObject(obj)).to.deep.equal(obj, 'subtrahend doesnt match obj');
			expect(minuend.filterObject(obj)).to.deep.equal(obj, 'minuend doesnt match obj');
			expect(difference.filterObject(obj)).to.deep.equal(filtered, 'difference matches obj');
		});
		it('still matches what the subtrahend did not match', function() {
			const obj = {
				num1: 0,
				nul1: 1,
				obj: { foo: 2 },
				obj1: { foo: 3 },
				obj3: { foo: { foo: 5 } }
			};
			const filtered = { obj: {}, obj1: {}, obj3: { foo: {} } };
			expect(subtrahend.filterObject(obj)).to.deep.equal(filtered, 'subtrahend matches obj');
			expect(minuend.filterObject(obj)).to.deep.equal(obj, 'minuend doesnt match obj');
			expect(difference.filterObject(obj)).to.deep.equal(obj, 'difference doesnt match obj');
		});
		it('still doesnt match what the minuend did not match', function() {
			const obj = { foo: 0, baz: { quux: 1 } };
			expect(minuend.filterObject(obj)).to.deep.equal({});
			expect(difference.filterObject(obj)).to.deep.equal({});
		});
		it('throws on attempt to subtract with scalars', function() {
			expect(() => ObjectMask.subtractMasks(3, { _: { foo: true } })).to.throw(XError);
			expect(() => ObjectMask.subtractMasks({ _: { foo: true } }, 3)).to.throw(XError);
		});
	});

	describe('#filterObject()', function() {
		let obj = {
			str1: 'string',
			str2: 'string2',
			num1: 1,
			num2: 2,
			nul1: null,
			nul2: null,
			undef: undefined,
			obj: { foo: 'test', bar: 'test2', baz: 'test3' },
			arr: [
				{ str1: 'one', str2: 'two' },
				{ str1: 'three', str2: 'four' }
			]
		};
		it('gets the fields in an object the mask matches', function() {
			const mask = new ObjectMask({
				str1: true,
				num1: true,
				nul1: true,
				obj: { bar: true, nonexist: true }
			});
			const result = mask.filterObject(objtools.deepCopy(obj));
			expect(result).to.deep.equal({
				str1: 'string',
				num1: 1,
				nul1: null,
				obj: { bar: 'test2' }
			});
		});
		it('handles arrays and wildcards', function() {
			const mask = new ObjectMask({
				obj: { _: true, bar: false },
				arr: [ { str2: true } ]
			});
			const result = mask.filterObject(objtools.deepCopy(obj));
			expect(result).to.deep.equal({
				obj: { foo: 'test', baz: 'test3' },
				arr: [ { str2: 'two' }, { str2: 'four' } ]
			});
		});
	});

	describe('#getSubMask()', function() {
		it('gets a submask', function() {
			const mask = new ObjectMask({ foo: { bar: { baz: true } } });
			const result = mask.getSubMask('foo').toObject();
			expect(result).to.deep.equal({ bar: { baz: true } });
		});
		it('handles wildcards', function() {
			const mask = new ObjectMask({ obj: { _: true, foo: false } });
			expect(mask.getSubMask('obj.bar').mask).to.be.true;
			expect(mask.getSubMask('obj.foo').mask).to.be.false;
		});
	});

	describe('#checkPath()', function() {
		const mask = new ObjectMask({
			obj: { _: true, foo: false },
			arr: [ { str2: true } ]
		});
		it('checks if the mask matches the path', function() {
			expect(mask.checkPath('arr.8.str1')).to.be.false;
			expect(mask.checkPath('arr.8.str2')).to.be.true;
		});
		it('handles wildcards', function() {
			expect(mask.checkPath('obj.bar.foo')).to.be.true;
			expect(mask.checkPath('obj.foo.foo')).to.be.false;
		});
	});

	describe('#invertMask()', function() {
		it('inverts a flat mask using a wildcard', function() {
			const mask = new ObjectMask({ foo: true });
			const result = ObjectMask.invertMask(mask);
			const expected = { _: true, foo: false };
			expect(result.mask).to.deep.equal(expected);
		});
		it('handles wildcards', function() {
			const mask = new ObjectMask({ _: true, foo: false });
			const result = ObjectMask.invertMask(mask);
			const expected = { foo: true };
			expect(result.mask).to.deep.equal(expected);
		});
		it('recurses to submasks', function() {
			const mask = new ObjectMask({ foo: { _: true, bar: false } });
			const result = ObjectMask.invertMask(mask);
			const expected = { _: true, foo: { bar: true } };
			expect(result.mask).to.deep.equal(expected);
		});
	});

	describe('#validate()', function() {
		let mask1 = {
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		};
		let mask2 = {
			str1: true,
			num2: true,
			nul2: true,
			obj: { _: true, foo: false },
			arr: [ { str2: true } ]
		};
		it('returns true iff the mask is valid', function() {
			expect(new ObjectMask(mask1).validate()).to.be.true;
			expect(new ObjectMask(mask2).validate()).to.be.true;
			expect(new ObjectMask({ foo: new Date() }).validate()).to.be.false;
		});
	});

	describe('#getMaskedOutFields()', function() {
		const obj = {
			str1: 'string',
			str2: 'string2',
			num1: 1,
			num2: 2,
			nul1: null,
			nul2: null,
			undef: undefined,
			obj: { foo: 'test', bar: 'test2', baz: 'test3' },
			arr: [
				{ str1: 'one', str2: 'two' },
				{ str1: 'three', str2: 'four' }
			]
		};
		const mask = new ObjectMask({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		it('returns a list of fields disallowed by the mask', function() {
			const expected = [ 'num2', 'undef', 'obj.baz', 'arr.0.str2', 'arr.1.str2' ];
			expect(mask.getMaskedOutFields(obj).sort()).to.deep.equal(expected.sort());
		});
	});

	describe('#filterDottedObject()', function() {
		const obj = {
			str1: 'string',
			str2: 'string2',
			num1: 1,
			num2: 2,
			nul1: null,
			nul2: null,
			undef: undefined,
			obj: { foo: 'test', bar: 'test2', baz: 'test3' },
			arr: [
				{ str1: 'one', str2: 'two' },
				{ str1: 'three', str2: 'four' }
			]
		};
		const mask = new ObjectMask({
			str1: true,
			num2: true,
			nul2: true,
			obj: { _: true, foo: false },
			arr: [ { str2: true } ]
		});
		it('filters disallowed fields from a dotted object', function() {
			const filtered = mask.filterDottedObject(objtools.collapseToDotted(obj));
			const expected = {
				'str1': 'string',
				'num2': 2,
				'nul2': null,
				'obj.bar': 'test2',
				'obj.baz': 'test3',
				'arr.0.str2': 'two',
				'arr.1.str2': 'four'
			};
			expect(filtered).to.deep.equal(expected);
		});
	});

	describe('#getDottedMaskedOutFields()', function() {
		let obj = {
			str1: 'string',
			str2: 'string2',
			num1: 1,
			num2: 2,
			nul1: null,
			nul2: null,
			undef: undefined,
			obj: { foo: 'test', bar: 'test2', baz: 'test3' },
			arr: [
				{ str1: 'one', str2: 'two' },
				{ str1: 'three', str2: 'four' }
			]
		};
		let mask = new ObjectMask({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		const fields = mask.getDottedMaskedOutFields(objtools.collapseToDotted(obj));
		it('gets a list of fields in a dotted object disallowed by the mask', function() {
			const expected = [ 'num2', 'undef', 'obj.baz', 'arr.0.str2', 'arr.1.str2' ];
			expect(fields).to.deep.equal(expected);
		});
	});

	describe('#checkFields()', function() {
		const mask = new ObjectMask({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		it('returns a predicate for whether a dotted field is allowed by a mask', function() {
			expect(mask.checkFields({ str1: 5 })).to.be.true;
			expect(mask.checkFields({ num2: 5 })).to.be.false;
			expect(mask.checkFields({ obj: { foo: 5 } })).to.be.true;
			expect(mask.checkFields({ obj: { baz: 5 } })).to.be.false;
		});
	});

	describe('#checkDottedFields()', function() {
		const mask = new ObjectMask({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		it('returns a predicate for whether a dotted object matches the mask', function() {
			expect(mask.checkDottedFields({ 'obj.foo': 5 })).to.be.true;
			expect(mask.checkDottedFields({ 'obj.baz': 5 })).to.be.false;
		});
	});

	describe('#createMaskFromFieldList()', function() {
		const fields = [ 'foo', 'bar.baz', 'bar.baz.biz' ];
		const result = ObjectMask.createMaskFromFieldList(fields).toObject();
		it('makes a mask that matches the fields in the fieldlist', function() {
			const expected = { foo: true, bar: { baz: true } };
			expect(result).to.deep.equal(expected);
		});
	});

	describe('#createFilterFunc()', function() {
		const obj = {
			str1: 'string',
			str2: 'string2',
			num1: 1,
			num2: 2,
			nul1: null,
			nul2: null,
			undef: undefined,
			obj: { foo: 'test', bar: 'test2', baz: 'test3' },
			arr: [
				{ str1: 'one', str2: 'two' },
				{ str1: 'three', str2: 'four' }
			]
		};
		const mask = new ObjectMask({
			str1: true,
			str2: true,
			num1: true,
			nul1: true,
			nul2: true,
			obj: { foo: true, bar: true },
			arr: [ { str1: true } ]
		});
		const func = mask.createFilterFunc();
		it('makes a predicate for whether an object matches a mask', function() {
			const expected = {
				str1: 'string',
				str2: 'string2',
				num1: 1,
				nul1: null,
				nul2: null,
				obj: { foo: 'test', bar: 'test2' },
				arr: [ { str1: 'one' }, { str1: 'three' } ]
			};
			expect(func(obj)).to.deep.equal(expected);
		});
	});

	describe('#addField()', function() {
		it('does not affect masks that already match', function() {
			const orig = new ObjectMask({ foo: true });
			const expected = _.cloneDeep(orig);
			expect(orig.addField('foo.bar')).to.deep.equal(expected);
		});
		it('recurses to subfields', function() {
			const orig = new ObjectMask({ foo: false, baz: true });
			const expected = new ObjectMask({ foo: { bar: true }, baz: true });
			expect(orig.addField('foo.bar')).to.deep.equal(expected);
		});
		it('prunes to become more general', function() {
			const orig = new ObjectMask({ foo: { bar: true } });
			const expected = new ObjectMask({ foo: true });
			expect(orig.addField('foo')).to.deep.equal(expected);
		});
		it('does not become more restrictive', function() {
			const orig = new ObjectMask({ _: true });
			const shouldPass = { foo: { baz: 1 } };
			expect(orig.checkFields(shouldPass)).to.be.true;
			expect(orig.addField('foo.bar').checkFields(shouldPass)).to.be.true;
		});
	});

	describe('#removeField()', function() {
		const shouldPass = { foo: { bar: { foobar: true } } };
		const shouldAlsoPass = { foo: { biz: { baz: true } } };
		const shouldFail = { foo: { bar: { baz: true } } };
		const expected = new ObjectMask({ foo: {
			bar: { baz: false, foobar: true },
			_: { baz: true, foobar: true } }
		});
		it('branches wildcards', function() {
			let orig = new ObjectMask({ foo: { _: { baz: true, foobar: true } } });
			expect(orig.removeField('foo.bar.baz').checkFields(shouldPass), 'post: shouldPass').to.be.true;
			expect(orig.removeField('foo.bar.baz').checkFields(shouldAlsoPass), 'post: shouldAlsoPass').to.be.true;
			expect(orig.removeField('foo.bar.baz').checkFields(shouldFail), 'post: shouldFail').to.be.false;
			expect(orig.removeField('foo.bar.baz')).to.deep.equal(expected);
		});
		it('doesnt remove other fields', function() {
			let orig = new ObjectMask({ foo: { _: { baz: true, foobar: true } } });
			expect(orig.checkFields(shouldPass), 'pre: shouldPass').to.be.true;
			expect(orig.checkFields(shouldAlsoPass), 'pre: shouldAlsoPass').to.be.true;
			expect(orig.checkFields(shouldFail), 'pre: shouldFail').to.be.true;
			expect(orig.removeField('foo.bar.baz').checkFields(shouldPass), 'post: shouldPass').to.be.true;
			expect(orig.removeField('foo.bar.baz').checkFields(shouldAlsoPass), 'post: shouldAlsoPass').to.be.true;
			expect(orig.removeField('foo.bar.baz').checkFields(shouldFail), 'post: shouldFail').to.be.false;
		});
		it('doesnt match new fields', function() {
			let orig = new ObjectMask({ _: { bar: { baz: true } } });
			let shouldFail = { foo: { bar: { foobar: true } } };
			expect(orig.checkFields(shouldFail)).to.be.false;
			expect(orig.removeField('foo.bar.baz').checkFields(shouldFail)).to.be.false;
		});
		it('throws on attempt to remove wildcard', function() {
			let orig = new ObjectMask({ _: [ true ] });
			expect(() => orig.removeField('_')).to.throw();
			expect(() => orig.removeField('foo._')).to.throw(XError);
		});
	});
});
