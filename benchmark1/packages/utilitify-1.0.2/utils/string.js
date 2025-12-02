"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function getTruncatedString(str, length, punctuationMark) {
    if (utils_1.isNil(str))
        return '';
    if (str.length <= length)
        return str;
    return punctuationMark
        ? `${str.substring(0, length)}${punctuationMark}`
        : `${str.substring(0, length)}`;
}
exports.getTruncatedString = getTruncatedString;
function isJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isJsonString = isJsonString;
function getJsonFromString(str) {
    let result;
    try {
        result = JSON.parse(str);
    }
    catch (e) {
        return {};
    }
    return result;
}
exports.getJsonFromString = getJsonFromString;
function toPascalCase(string) {
    return `${string}`
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(new RegExp(/\s+(.)(\w+)/, 'g'), (_, $2, $3) => `${$2.toUpperCase()}${$3.toLowerCase()}`)
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}
exports.toPascalCase = toPascalCase;

//# sourceMappingURL=string.js.map
