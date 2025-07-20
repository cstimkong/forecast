'use strict';

/**
 * Module dependencies
 */

var union = require('arr-union');
var clone = require('clone-deep');
var typeOf = require('kind-of');

var isObject = function(val) {
  return typeOf(val) === 'object' || typeOf(val) === 'function';
};

/**
 * Expose `utils` modules
 */

module.exports = {
    isObject: isObject,
    union: union,
    clone: clone,
    typeOf: typeOf
};

