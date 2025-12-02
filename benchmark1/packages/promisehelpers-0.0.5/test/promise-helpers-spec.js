'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var promiseHelpers = require('../src/index.js');
var wrap = promiseHelpers.wrap;
var notify = promiseHelpers.notify;
var insert = promiseHelpers.insert;
var log = promiseHelpers.log;


chai.should();
chai.use(sinonChai);

describe('promise utility functions', function() {
  it('wraps values in objects', function() {
    var obj = {};
    var wrapFunc = wrap(obj, 'property');

    wrapFunc(123).should.have.property('property', 123);
  });

  describe('notify', function() {
    var notifyFunc;
    var spy;

    beforeEach(function() {
      spy = sinon.spy();
      notifyFunc = notify(spy);
    });

    it('calls the passed in function', function() {
      notifyFunc();
      spy.should.have.been.called;
    });

    it('closure returns the value passed to it', function() {
      notifyFunc(321).should.equal(321);
    });
  });

  describe('insert', function() {
    it('places values in an object and returns the object', function() {
      insert('key', 'value')({})
        .should.deep.equal({
          key: 'value'
        });
    });

    it('deeply inserts objects', function() {
      insert(['key1', 'key2', 'key3'], 'value')({})
        .should.deep.equal({
          key1: {key2: {key3: 'value'}}
        });
    });

    it('deeply inserts when objects are already present', function() {
      insert(['key1', 'key2', 'key3'], 'value')({
        key1: {otherKey: 'otherValue'}
      })
      .should.deep.equal({
        key1: {
          key2: {
            key3: 'value'
          },
          otherKey: 'otherValue'
        }
      });
    });
  });

  describe('log', function() {
    it('returns the promise value', function() {
      log('promise value')
        .should.equal('promise value');
    });
  });
});
