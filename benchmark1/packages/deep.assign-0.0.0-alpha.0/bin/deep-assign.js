'use strict';

function deepAssign () {
  let argv = [...arguments];
  let result = argv.shift();
  let nodes = [];
  let current = [argv.shift()];
  while (current) {
    for (let key in current[0]) {
      if (current[0][key] && typeof current[0][key] === 'object') {
        let parent;
        let isArray = Array.isArray(current[0][key]);
        if (current[1]) {
          current[1][key] = (current[1][key] && typeof current[1][key] === 'object') ? current[1][key] : (isArray) ? [] : {};
          parent = current[1][key];
        } else {
          result[key] = (result[key] && typeof result[key] === 'object') ? result[key] : (isArray) ? [] : {};
          parent = result[key];
        }
        nodes.push([current[0][key], parent]);
      } else {
        if (current[1]) current[1][key] = current[0][key];
        else result[key] = current[0][key];
      }
    }
    current = nodes.shift();
  }
  if (argv.length) return deepAssign(...[result].concat(argv));
  return result;
}

module.exports = deepAssign;