// globalThis.__record__ = function __record__(item) {
//     console.log('Log start: %d, end: %d, filename: %s, type: %s', item.start, item.end, item.filename, item.type);
// }

let loadNodeJSModule = require('../lib/loadmodule');
let mod = loadNodeJSModule('/Users/kongdezhen/Projects/FesaJS/node_modules/js-yaml');

const {forcedExecution, makeProxyString} = require('../lib/forced-execution');

let successCount = 0;
for (let i = 0; i < 1000; i++) {
    try {
        let taintInfo = []
        globalThis.__record__ = function(item) {
            taintInfo.push(item);
        };
        globalThis.__makeProxyString__ = makeProxyString;
        forcedExecution(mod.load, 4);
        successCount += 1;
        console.log(taintInfo);
    } catch (e) {
        // console.error(e.message);
    }
}

console.log(successCount);