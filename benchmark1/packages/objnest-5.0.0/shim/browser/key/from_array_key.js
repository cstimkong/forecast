/**
 * Convert from array key.
 * @function fromArrayKey
 * @param {string} key - Key to convert.
 * @returns {string} - Converted key.
 */
'use strict';
/** @lends fromArrayKey */

function fromArrayKey(key) {
  var indexKey = key.match(/\[([^\]]+)]$/)[1];
  return {
    name: key.replace(/\[[^\]]+]$/, ''),
    index: /^\d+$/.test(indexKey) ? Number(indexKey) : null,
    key: indexKey
  };
}

module.exports = fromArrayKey;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZyb21fYXJyYXlfa2V5LmpzIl0sIm5hbWVzIjpbImZyb21BcnJheUtleSIsImtleSIsImluZGV4S2V5IiwibWF0Y2giLCJuYW1lIiwicmVwbGFjZSIsImluZGV4IiwidGVzdCIsIk51bWJlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQTtBQUVBOztBQUNBLFNBQVNBLFlBQVQsQ0FBdUJDLEdBQXZCLEVBQTRCO0FBQzFCLE1BQU1DLFFBQVEsR0FBR0QsR0FBRyxDQUFDRSxLQUFKLENBQVUsY0FBVixFQUEwQixDQUExQixDQUFqQjtBQUNBLFNBQU87QUFDTEMsSUFBQUEsSUFBSSxFQUFFSCxHQUFHLENBQUNJLE9BQUosQ0FBWSxZQUFaLEVBQTBCLEVBQTFCLENBREQ7QUFFTEMsSUFBQUEsS0FBSyxFQUFFLFFBQVFDLElBQVIsQ0FBYUwsUUFBYixJQUF5Qk0sTUFBTSxDQUFDTixRQUFELENBQS9CLEdBQTRDLElBRjlDO0FBR0xELElBQUFBLEdBQUcsRUFBRUM7QUFIQSxHQUFQO0FBS0Q7O0FBRURPLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlYsWUFBakIiLCJzb3VyY2VSb290IjoiLi4vLi4vbGliIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb252ZXJ0IGZyb20gYXJyYXkga2V5LlxuICogQGZ1bmN0aW9uIGZyb21BcnJheUtleVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIEtleSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gLSBDb252ZXJ0ZWQga2V5LlxuICovXG4ndXNlIHN0cmljdCdcblxuLyoqIEBsZW5kcyBmcm9tQXJyYXlLZXkgKi9cbmZ1bmN0aW9uIGZyb21BcnJheUtleSAoa2V5KSB7XG4gIGNvbnN0IGluZGV4S2V5ID0ga2V5Lm1hdGNoKC9cXFsoW15cXF1dKyldJC8pWzFdXG4gIHJldHVybiB7XG4gICAgbmFtZToga2V5LnJlcGxhY2UoL1xcW1teXFxdXStdJC8sICcnKSxcbiAgICBpbmRleDogL15cXGQrJC8udGVzdChpbmRleEtleSkgPyBOdW1iZXIoaW5kZXhLZXkpIDogbnVsbCxcbiAgICBrZXk6IGluZGV4S2V5LFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnJvbUFycmF5S2V5XG4iXX0=