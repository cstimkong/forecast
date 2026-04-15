
const forcedExecution = require('../lib/forced-execution');
let {set} = require('json-pointer');

describe('test forced execution', function() {
    it('test forced execution 1', function() {
        
        let successCount = 0;
        for (let i = 0; i < 1000000; i++) {
            try {
                forcedExecution(set, 3);
                successCount += 1;
            } catch (e) {
                console.error(e.message);
            }
        }

        console.log('Success count:', successCount);
    })
});


