"use strict";
const get = require("./get");
const set = require("./set");
const deleteFunc = require("./delete");
const pick = require("./pick");
const keys = require("./keys");
const entries = require("./entries");
const equals = require("./equals");
const clear_empties_1 = require("./clear_empties");
module.exports = {
    get,
    set,
    "delete": deleteFunc,
    pick,
    keys,
    entries,
    equals,
    clearEmpties: clear_empties_1.clearEmpties
};
//# sourceMappingURL=index.js.map