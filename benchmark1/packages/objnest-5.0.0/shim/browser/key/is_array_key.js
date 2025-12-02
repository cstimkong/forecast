/**
 * Detect is an array key.
 * @memberof module:objnest/lib/key
 * @function isArrayKey
 * @param {string} key - Key to convert.
 * @returns {boolean} - Is array key or not.
 */
'use strict';
/** @lends isArrayKey */

function isArrayKey(key) {
  return /\[[^\]]*]$/.test(key);
}

module.exports = isArrayKey;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzX2FycmF5X2tleS5qcyJdLCJuYW1lcyI6WyJpc0FycmF5S2V5Iiwia2V5IiwidGVzdCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBT0E7QUFFQTs7QUFDQSxTQUFTQSxVQUFULENBQXFCQyxHQUFyQixFQUEwQjtBQUN4QixTQUFPLGFBQWFDLElBQWIsQ0FBa0JELEdBQWxCLENBQVA7QUFDRDs7QUFFREUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSixVQUFqQiIsInNvdXJjZVJvb3QiOiIuLi8uLi9saWIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERldGVjdCBpcyBhbiBhcnJheSBrZXkuXG4gKiBAbWVtYmVyb2YgbW9kdWxlOm9iam5lc3QvbGliL2tleVxuICogQGZ1bmN0aW9uIGlzQXJyYXlLZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBLZXkgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtib29sZWFufSAtIElzIGFycmF5IGtleSBvciBub3QuXG4gKi9cbid1c2Ugc3RyaWN0J1xuXG4vKiogQGxlbmRzIGlzQXJyYXlLZXkgKi9cbmZ1bmN0aW9uIGlzQXJyYXlLZXkgKGtleSkge1xuICByZXR1cm4gL1xcW1teXFxdXSpdJC8udGVzdChrZXkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUtleVxuIl19