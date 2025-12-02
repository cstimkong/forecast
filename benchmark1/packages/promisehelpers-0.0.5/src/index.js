'use strict';

/** @module PomiseHelpers */

var isArray = require('isarray');

var insertHelper = function(keys, value, object) {
  var index;
  var key;
  var nestedObject = object;

  for(index = 0; index < keys.length; index++) {
    key = keys[index];

    if(!nestedObject[key]) {
      nestedObject[key] = {};
    }

    if(index === keys.length - 1) {
      nestedObject[key] = value;
    } else {
      nestedObject = nestedObject[key];
    }
  }

  return object;
};

/** Takes a promise value and "wraps" it inside
 *  the wrapperObject passed to wrap, at the
 *  propertyName passed to wrap.
 *  @function
 *  @name wrap
 *  @param {object} wrapperObject object on which you want the property stored
 *  @param {string} propertyName key you want to store the subsequent value at on the wrapperObject
 *  @return {function} doWrap function with one argument: the value to be stored at propertyName on wrapperObject
 */
module.exports.wrap = function(obj, property) {
  return function(value) {
    obj[property] = value;
    return obj;
  };
};

/** Takes a function(funcA) passed to it and returns a new function
 *  which executes [funcA] and then returns whatever it was passed.
 *  @function
 *  @name notify
 *  @param {function} callback the function to be called
 *  @return {function} notifyWrapper calls the callback, and then returns whatever was passed to it
 */
module.exports.notify = function(func) {
  return function(value) {
    func();
    return value;
  };
};

/** Places a value in an object at an arbitrary depth
 *  specified by a keyPath.
 *  @function
 *  @name insert
 *  @param {string|array} key(s) either a single string, or an array of strings
 *  representing the key path at which the insertion should occur.
 *  @param {value} insertable
 *  @return {function} insertion helper which takes an object for inserting into
 */
module.exports.insert = function(key, value) {
  return function(object) {
    if(isArray(key)) {
      return insertHelper(key, value, object);
    }

    object[key] = value;
    return object;
  };
};

/** log the promise value to the console
 *  @function
 *  @name log
 *  @param {value} promise value
 *  @return {value} promise value
 */
module.exports.log = function(promiseValue) {
  console.log(promiseValue);
  return promiseValue;
};
