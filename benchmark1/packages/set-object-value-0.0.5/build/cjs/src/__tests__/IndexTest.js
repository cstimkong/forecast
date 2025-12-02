'use strict';

var _interopRequireDefault = require("reshow-runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("../index.js"));

var _chai = require("chai");

describe('Test set', function () {
  it('check set result', function () {
    var obj = {};
    (0, _index["default"])(obj, ['a', 'b'], 'c');
    (0, _chai.expect)(obj).to.deep.equal({
      a: {
        b: 'c'
      }
    });
  });
});
describe('Test append', function () {
  it('test simple append', function () {
    var obj = {};
    (0, _index["default"])(obj, ['a'], 'a1', true);
    (0, _index["default"])(obj, ['a'], 'a2', true);
    (0, _chai.expect)(obj).to.deep.equal({
      a: ['a1', 'a2']
    });
  });
  it('should keep origin value', function () {
    var obj = {};
    (0, _index["default"])(obj, ['a'], 'a3');
    (0, _index["default"])(obj, ['a'], 'a4', true);
    (0, _chai.expect)(obj).to.deep.equal({
      a: ['a3', 'a4']
    });
  });
});