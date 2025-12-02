"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var replaceValue = function replaceValue(obj, arrKey, val, isAppend) {
  var last = arrKey.pop();
  arrKey.forEach(function (k) {
    obj[k] = obj[k] || {};
    obj = obj[k];
  });

  if (isAppend && (!obj[last] || !obj[last].push)) {
    if (!obj[last]) {
      obj[last] = [val];
    } else {
      obj[last] = [obj[last], val];
    }
  } else if (isAppend && obj[last].push) {
    obj[last].push(val);
  } else {
    obj[last] = val;
  }
};

var _default = replaceValue;
exports["default"] = _default;
module.exports = exports.default;