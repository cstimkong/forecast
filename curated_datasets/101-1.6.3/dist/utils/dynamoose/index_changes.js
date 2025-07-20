"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelIndexChangeType = void 0;
const obj = require("../object");
var ModelIndexChangeType;
(function (ModelIndexChangeType) {
    ModelIndexChangeType["add"] = "add";
    ModelIndexChangeType["delete"] = "delete";
})(ModelIndexChangeType = exports.ModelIndexChangeType || (exports.ModelIndexChangeType = {}));
const index_changes = async (model, existingIndexes = []) => {
    const output = [];
    const expectedIndexes = await model.getIndexes();
    // Indexes to delete
    const deleteIndexes = existingIndexes.filter((index) => !(expectedIndexes.GlobalSecondaryIndexes || []).find((searchIndex) => obj.equals(index, searchIndex))).map((index) => ({ "name": index.IndexName, "type": ModelIndexChangeType.delete }));
    output.push(...deleteIndexes);
    // Indexes to create
    const createIndexes = (expectedIndexes.GlobalSecondaryIndexes || []).filter((index) => ![...output.map((i) => i.name), ...existingIndexes.map((i) => i.IndexName)].includes(index.IndexName)).map((index) => ({
        "type": ModelIndexChangeType.add,
        "spec": index
    }));
    output.push(...createIndexes);
    return output;
};
exports.default = index_changes;
//# sourceMappingURL=index_changes.js.map