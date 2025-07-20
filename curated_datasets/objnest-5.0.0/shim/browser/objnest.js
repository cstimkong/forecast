/**
 * @class Objnest
 * @param {object} config
 */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var extend = require('extend');

var abind = require('abind');

var isArrayKey = require('./key/is_array_key');

var fromArrayKey = require('./key/from_array_key');

var toArrayKey = require('./key/to_array_key');
/** @lends Objnest */


function Objnest(config) {
  extend(this, config || {});
  abind(this);
}

Objnest.prototype = {
  separator: '.',

  /**
   * @function expand
   * @param {object} object - Obj to flatten
   * @returns {object} Flatten obj.
   * @example
   *  const obj = objnest.expand({
   *      'foo.bar': 'baz'
   *  })
   *  console.log(obj) // => {foo: {bar: 'baz'}}
   */
  expand: function expand(object) {
    var _this = this;

    if (Array.isArray(object)) {
      return object.map(function (object) {
        return _this.expand(object);
      });
    }

    var separator = this.separator;
    var result = {};

    var _arr = Object.keys(object);

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];
      var val = object[key];
      var needsSeparate = !!~key.indexOf(separator);

      if (needsSeparate) {
        var subKeys = key.split(separator);
        var subObj = {};
        var thisKey = subKeys.shift();
        subObj[subKeys.join('.')] = val;
        var subExpandedObj = this.expand(subObj);
        var thisVal = result[thisKey];
        val = this._merge(thisVal, subExpandedObj);
        key = thisKey;
      }

      if (isArrayKey(key)) {
        var arrayKey = fromArrayKey(key);

        if (!result[arrayKey.name]) {
          var length = object["".concat(arrayKey.name, "[length]")] || 0;
          result[arrayKey.name] = new Array(length);
        }

        if (arrayKey.index !== null) {
          result[arrayKey.name][arrayKey.index] = this._merge(result[arrayKey.name][arrayKey.index], val);
        }
      } else {
        result[key] = val;
      }
    }

    return result;
  },

  /**
   * Flatten nested object.
   * @param {object} nested - Object to flatten.
   * @returns {object} - Flattened object.
   * @example
   *  const flattened = objnest.flatten({
   *      'foo': {'bar': 'baz'}
   *  })
   *  console.log(flattened) // => {'foo.bar': 'baz'}
   */
  flatten: function flatten(nested) {
    if (typeof nested === 'string') {
      return nested;
    }

    var separator = this.separator;
    var flattened = {};

    var _arr2 = Object.keys(nested || {});

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      var key = _arr2[_i2];
      var value = nested[key];

      if (value === null) {
        flattened[key] = value;
        continue;
      }

      switch ((0, _typeof2.default)(value)) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'function':
          flattened[key] = value;
          break;

        default:
          {
            var subValues = this.flatten(value);
            var isArray = Array.isArray(value);

            if (isArray) {
              flattened["".concat(key, "[length]")] = value.length;
            }

            var _arr3 = Object.keys(subValues);

            for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
              var subKey = _arr3[_i3];
              var fullKey = void 0;

              if (isArray) {
                fullKey = key + toArrayKey(subKey);
              } else {
                fullKey = [key, subKey].join(separator);
              }

              flattened[fullKey] = subValues[subKey];
            }

            break;
          }
      }
    }

    return flattened;
  },
  _merge: function _merge(v1, v2) {
    if (typeof v1 === 'undefined') {
      return v2;
    }

    if (typeof v2 === 'undefined') {
      return v1;
    }

    return extend(true, v1, v2 || {});
  }
};
module.exports = Objnest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iam5lc3QuanMiXSwibmFtZXMiOlsiZXh0ZW5kIiwicmVxdWlyZSIsImFiaW5kIiwiaXNBcnJheUtleSIsImZyb21BcnJheUtleSIsInRvQXJyYXlLZXkiLCJPYmpuZXN0IiwiY29uZmlnIiwicHJvdG90eXBlIiwic2VwYXJhdG9yIiwiZXhwYW5kIiwib2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwicmVzdWx0IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInZhbCIsIm5lZWRzU2VwYXJhdGUiLCJpbmRleE9mIiwic3ViS2V5cyIsInNwbGl0Iiwic3ViT2JqIiwidGhpc0tleSIsInNoaWZ0Iiwiam9pbiIsInN1YkV4cGFuZGVkT2JqIiwidGhpc1ZhbCIsIl9tZXJnZSIsImFycmF5S2V5IiwibmFtZSIsImxlbmd0aCIsImluZGV4IiwiZmxhdHRlbiIsIm5lc3RlZCIsImZsYXR0ZW5lZCIsInZhbHVlIiwic3ViVmFsdWVzIiwic3ViS2V5IiwiZnVsbEtleSIsInYxIiwidjIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUlBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLE9BQUQsQ0FBckI7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMsb0JBQUQsQ0FBMUI7O0FBQ0EsSUFBTUcsWUFBWSxHQUFHSCxPQUFPLENBQUMsc0JBQUQsQ0FBNUI7O0FBQ0EsSUFBTUksVUFBVSxHQUFHSixPQUFPLENBQUMsb0JBQUQsQ0FBMUI7QUFFQTs7O0FBQ0EsU0FBU0ssT0FBVCxDQUFrQkMsTUFBbEIsRUFBMEI7QUFDeEJQLEVBQUFBLE1BQU0sQ0FBQyxJQUFELEVBQU9PLE1BQU0sSUFBSSxFQUFqQixDQUFOO0FBQ0FMLEVBQUFBLEtBQUssQ0FBQyxJQUFELENBQUw7QUFDRDs7QUFFREksT0FBTyxDQUFDRSxTQUFSLEdBQW9C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QSxNQW5Ha0Isa0JBbUdWWSxFQW5HVSxFQW1HTkMsRUFuR00sRUFtR0Y7QUFDZCxRQUFJLE9BQU9ELEVBQVAsS0FBYyxXQUFsQixFQUErQjtBQUM3QixhQUFPQyxFQUFQO0FBQ0Q7O0FBQ0QsUUFBSSxPQUFPQSxFQUFQLEtBQWMsV0FBbEIsRUFBK0I7QUFDN0IsYUFBT0QsRUFBUDtBQUNEOztBQUNELFdBQU8xQyxNQUFNLENBQUMsSUFBRCxFQUFPMEMsRUFBUCxFQUFXQyxFQUFFLElBQUksRUFBakIsQ0FBYjtBQUNEO0FBM0dpQixDQUFwQjtBQThHQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdkMsT0FBakIiLCJzb3VyY2VSb290IjoiLi4vLi4vbGliIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAY2xhc3MgT2JqbmVzdFxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ1xuICovXG4ndXNlIHN0cmljdCdcblxuY29uc3QgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJylcbmNvbnN0IGFiaW5kID0gcmVxdWlyZSgnYWJpbmQnKVxuY29uc3QgaXNBcnJheUtleSA9IHJlcXVpcmUoJy4va2V5L2lzX2FycmF5X2tleScpXG5jb25zdCBmcm9tQXJyYXlLZXkgPSByZXF1aXJlKCcuL2tleS9mcm9tX2FycmF5X2tleScpXG5jb25zdCB0b0FycmF5S2V5ID0gcmVxdWlyZSgnLi9rZXkvdG9fYXJyYXlfa2V5JylcblxuLyoqIEBsZW5kcyBPYmpuZXN0ICovXG5mdW5jdGlvbiBPYmpuZXN0IChjb25maWcpIHtcbiAgZXh0ZW5kKHRoaXMsIGNvbmZpZyB8fCB7fSlcbiAgYWJpbmQodGhpcylcbn1cblxuT2JqbmVzdC5wcm90b3R5cGUgPSB7XG4gIHNlcGFyYXRvcjogJy4nLFxuICAvKipcbiAgICogQGZ1bmN0aW9uIGV4cGFuZFxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IC0gT2JqIHRvIGZsYXR0ZW5cbiAgICogQHJldHVybnMge29iamVjdH0gRmxhdHRlbiBvYmouXG4gICAqIEBleGFtcGxlXG4gICAqICBjb25zdCBvYmogPSBvYmpuZXN0LmV4cGFuZCh7XG4gICAqICAgICAgJ2Zvby5iYXInOiAnYmF6J1xuICAgKiAgfSlcbiAgICogIGNvbnNvbGUubG9nKG9iaikgLy8gPT4ge2Zvbzoge2JhcjogJ2Jheid9fVxuICAgKi9cbiAgZXhwYW5kIChvYmplY3QpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Lm1hcCgob2JqZWN0KSA9PiB0aGlzLmV4cGFuZChvYmplY3QpKVxuICAgIH1cbiAgICBjb25zdCBzZXBhcmF0b3IgPSB0aGlzLnNlcGFyYXRvclxuICAgIGNvbnN0IHJlc3VsdCA9IHt9XG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdCkpIHtcbiAgICAgIGxldCB2YWwgPSBvYmplY3Rba2V5XVxuICAgICAgY29uc3QgbmVlZHNTZXBhcmF0ZSA9ICEhfmtleS5pbmRleE9mKHNlcGFyYXRvcilcbiAgICAgIGlmIChuZWVkc1NlcGFyYXRlKSB7XG4gICAgICAgIGNvbnN0IHN1YktleXMgPSBrZXkuc3BsaXQoc2VwYXJhdG9yKVxuICAgICAgICBjb25zdCBzdWJPYmogPSB7fVxuICAgICAgICBjb25zdCB0aGlzS2V5ID0gc3ViS2V5cy5zaGlmdCgpXG4gICAgICAgIHN1Yk9ialtzdWJLZXlzLmpvaW4oJy4nKV0gPSB2YWxcbiAgICAgICAgY29uc3Qgc3ViRXhwYW5kZWRPYmogPSB0aGlzLmV4cGFuZChzdWJPYmopXG4gICAgICAgIGNvbnN0IHRoaXNWYWwgPSByZXN1bHRbdGhpc0tleV1cbiAgICAgICAgdmFsID0gdGhpcy5fbWVyZ2UodGhpc1ZhbCwgc3ViRXhwYW5kZWRPYmopXG4gICAgICAgIGtleSA9IHRoaXNLZXlcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5S2V5KGtleSkpIHtcbiAgICAgICAgY29uc3QgYXJyYXlLZXkgPSBmcm9tQXJyYXlLZXkoa2V5KVxuICAgICAgICBpZiAoIXJlc3VsdFthcnJheUtleS5uYW1lXSkge1xuICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IG9iamVjdFtgJHthcnJheUtleS5uYW1lfVtsZW5ndGhdYF0gfHwgMFxuICAgICAgICAgIHJlc3VsdFthcnJheUtleS5uYW1lXSA9IG5ldyBBcnJheShsZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFycmF5S2V5LmluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0W2FycmF5S2V5Lm5hbWVdW2FycmF5S2V5LmluZGV4XSA9IHRoaXMuX21lcmdlKFxuICAgICAgICAgICAgcmVzdWx0W2FycmF5S2V5Lm5hbWVdW2FycmF5S2V5LmluZGV4XSxcbiAgICAgICAgICAgIHZhbFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9LFxuICAvKipcbiAgICogRmxhdHRlbiBuZXN0ZWQgb2JqZWN0LlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmVzdGVkIC0gT2JqZWN0IHRvIGZsYXR0ZW4uXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gRmxhdHRlbmVkIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICogIGNvbnN0IGZsYXR0ZW5lZCA9IG9iam5lc3QuZmxhdHRlbih7XG4gICAqICAgICAgJ2Zvbyc6IHsnYmFyJzogJ2Jheid9XG4gICAqICB9KVxuICAgKiAgY29uc29sZS5sb2coZmxhdHRlbmVkKSAvLyA9PiB7J2Zvby5iYXInOiAnYmF6J31cbiAgICovXG4gIGZsYXR0ZW4gKG5lc3RlZCkge1xuICAgIGlmICh0eXBlb2YgbmVzdGVkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5lc3RlZFxuICAgIH1cbiAgICBjb25zdCBzZXBhcmF0b3IgPSB0aGlzLnNlcGFyYXRvclxuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IHt9XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobmVzdGVkIHx8IHt9KSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBuZXN0ZWRba2V5XVxuICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIGZsYXR0ZW5lZFtrZXldID0gdmFsdWVcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgZmxhdHRlbmVkW2tleV0gPSB2YWx1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICBjb25zdCBzdWJWYWx1ZXMgPSB0aGlzLmZsYXR0ZW4odmFsdWUpXG4gICAgICAgICAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgICAgIGZsYXR0ZW5lZFtgJHtrZXl9W2xlbmd0aF1gXSA9IHZhbHVlLmxlbmd0aFxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGNvbnN0IHN1YktleSBvZiBPYmplY3Qua2V5cyhzdWJWYWx1ZXMpKSB7XG4gICAgICAgICAgICBsZXQgZnVsbEtleVxuICAgICAgICAgICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgZnVsbEtleSA9IGtleSArIHRvQXJyYXlLZXkoc3ViS2V5KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnVsbEtleSA9IFtrZXksIHN1YktleV0uam9pbihzZXBhcmF0b3IpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbGF0dGVuZWRbZnVsbEtleV0gPSBzdWJWYWx1ZXNbc3ViS2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuZWRcbiAgfSxcbiAgX21lcmdlICh2MSwgdjIpIHtcbiAgICBpZiAodHlwZW9mIHYxID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHYyXG4gICAgfVxuICAgIGlmICh0eXBlb2YgdjIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gdjFcbiAgICB9XG4gICAgcmV0dXJuIGV4dGVuZCh0cnVlLCB2MSwgdjIgfHwge30pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmpuZXN0XG4iXX0=