'use strict';

const keyPath = require('../'),
	expect = require('chai').expect,
	merge = require('merge');

let obj = { this: { is: { a: { value: 1 } } } };
let arr = [
	{ this: { is: { a: [{ value: 1 }, { value: 2 }] } } },
	{ this: { is: { a: [{ value: 3 }, { value: 4 }] } } },
];

const test = (options) => {

	const convert = (str) => {
		return str.split('.').join((options || {}).separator || '.');
	};
	
	it ('should come back with value', () => {
		expect(keyPath(obj).get(convert('this.is.a.value'), merge(true, options))).to.equal(1);
	});
	
	it ('should come back with undefined', () => {
		expect(keyPath(obj).get(convert('this.is.not.a.value'), merge(true, options))).to.equal(undefined);
	});
	
	it ('should set value (creating intermediate objects), return the object and read it back', () => {
		obj = keyPath(obj).set(convert('this.is.a.new.value'), true, merge(true, options)).result;
		expect(keyPath(obj).get(convert('this.is.a.new.value'), merge(true, options))).to.equal(true);
	});
	
	it ('should modify original object', () => {
		expect(obj.this.is.a.new.value).to.equal(true);
	});
	
	it ('should come back with all items', () => {
		expect(keyPath(arr).getAll(convert('this.is.a.value'), merge(true, options))).to.deep.equal([1,2,3,4]);
	});
	
	it ('should throw an error if components are fed with non-string.', () => {
		expect(() => { keyPath.components(['a', 'key', 'ath']); }).to.throw(Error, '`keyPath` must be a string.');
	});
	
	it ('should come back with components.', () => {
		expect(keyPath.components(convert('this.is.a.key.path'), merge(true, options))).to.be.an('Array').with.lengthOf(5);
	});
	
	it ('should come back with an empty components.', () => {
		expect(keyPath.components('', merge(true, options))).to.be.an('Array').with.lengthOf(0);
	});
	
	it ('should join key path.', () => {
		expect(keyPath.join(['this','is','a','key','path'], merge(true, options))).to.equal(convert('this.is.a.key.path'));
	});
	
	it ('should throw an error if input is not an array when joining.', () => {
		expect(() => { keyPath.join(convert('this.is.a.key.path'), merge(true, options)); }).to.throw(Error, '`components` must be an array.');
	});
	
	it ('should append a key.', () => {
		expect(keyPath.append(convert('this.is.a.key'), 'path', merge(true, options))).to.equal(convert('this.is.a.key.path'));
	});
	
	it ('should come back with the last component.', () => {
		expect(keyPath.last(convert('this.is.a.key.path'), merge(true, options))).to.equal('path');
	});
	
	it ('should come back without the last component removed.', () => {
		expect(keyPath.eatLast(convert('this.is.a.key.path'), merge(true, options))).to.equal(convert('this.is.a.key'));
	});
	
	it ('should come back with the first component.', () => {
		expect(keyPath.first(convert('this.is.a.key.path'), merge(true, options))).to.equal('this');
	});
	
	it ('should come back with the first component removed.', () => {
		expect(keyPath.eatFirst(convert('this.is.a.key.path'), merge(true, options))).to.equal(convert('is.a.key.path'));
	});
	
	it ('should come back with the first component of other key path removed.', () => {
		expect(keyPath.eatFirst(convert('this.is.a.key.path'), convert('this.is.a'), merge(true, options))).to.equal(convert('key.path'));
	});
	
	it ('should throw an error when eating key path is not within key path.', () => {
		expect(() => { keyPath.eatFirst(convert('this.is.a.key.path'), convert('this.is.another'), merge(true, options)); }).to.throw(Error, '`eat` is not with key path.');
	});
	
	it ('should come back with the depth of the key path.', () => {
		expect(keyPath.depth(convert('this.is.a.key.path'), merge(true, options))).to.equal(5);
	});
	
	it ('should come back with `false` if key path is not within another.', () => {
		expect(keyPath.within(convert('this.is.my.first.path'), convert('this.is.my.second'), merge(true, options))).to.equal(false);
	});
	
	it ('should come back with `true` if key path is within another', () => {
		expect(keyPath.within(convert('this.is.my'), convert('this.is.my.second'), merge(true, options))).to.equal(true);
	});
	
	it ('should come back with `true` if key path is equal to another', () => {
		expect(keyPath.within(convert('this.is.my'), convert('this.is.my'), merge(true, options))).to.equal(true);
	});
	
	it ('should come back with `false` if key path is longer than another', () => {
		expect(keyPath.within(convert('this.is.my.first.key.path'), convert('this.is.my'), merge(true, options))).to.equal(false);
	});
	
	it ('should come back with all the keys in an object', () => {
		expect(keyPath({ a: 123, b: { c: 456, d: { e: 789, f: 'abc' } }}).keyPaths(merge(true, options)))
			.to.have.members(['a', 'b', convert('b.c'), convert('b.d'), convert('b.d.e'), convert('b.d.f')]);
	});
	
	it ('should come back with all the keys in an object (with specific depth)', () => {
		expect(keyPath({ a: 123, b: { c: 456, d: { e: 789, f: 'abc' } }}).keyPaths(merge({ depth: 0 }, merge(true, options))))
			.to.have.members(['a', 'b']);
	});
	
	it ('should come back with all the keys in an object (without any ds)', () => {
		expect(keyPath({ a: 123, b: { c: 456, d: { e: 789, f: 'abc' } }}).keyPaths(merge({ tester: (keyPath) => {
			return keyPath.indexOf('d') == -1;
		}}, merge(true, options)))).to.have.members(['a', 'b', convert('b.c'), convert('b.d')]);
	});
	
	it ('should ignore arrays', () => {
		expect(keyPath({ a: [123,456] }).keyPaths(merge(true, options))).to.have.members(['a']);
	});

};

test();
test({ separator: '.' });
test({ separator: ':' });
