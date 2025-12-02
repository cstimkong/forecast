'use strict';

import set from '../index.js';
import { expect } from 'chai';
describe('Test set', function () {
  it('check set result', function () {
    var obj = {};
    set(obj, ['a', 'b'], 'c');
    expect(obj).to.deep.equal({
      a: {
        b: 'c'
      }
    });
  });
});
describe('Test append', function () {
  it('test simple append', function () {
    var obj = {};
    set(obj, ['a'], 'a1', true);
    set(obj, ['a'], 'a2', true);
    expect(obj).to.deep.equal({
      a: ['a1', 'a2']
    });
  });
  it('should keep origin value', function () {
    var obj = {};
    set(obj, ['a'], 'a3');
    set(obj, ['a'], 'a4', true);
    expect(obj).to.deep.equal({
      a: ['a3', 'a4']
    });
  });
});