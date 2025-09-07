"use strict";

function unflatten(obj = {}) {
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  const resultholder = {};

  for (const p in obj) {
    let curr = resultholder;
    let prop = "";
    let m = {};

    while ((m = regex.exec(p))) {
      curr = curr[prop] || (curr[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }

    curr[prop] = obj[p];
  }

  return resultholder[""] || resultholder;
}

module.exports = unflatten;
