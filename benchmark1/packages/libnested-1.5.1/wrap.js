"use strict";

function wrap(idxs = []) {
  if (Array.isArray(idxs)) {
    let line = "";

    for (let i = 0; i < idxs.length; i++) {
      line += `[${idxs[i]}]`;
    }

    return line;
  }

  return `[${idxs}]`;
}

module.exports = wrap;
