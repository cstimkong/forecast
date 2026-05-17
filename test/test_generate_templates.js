import {generateTemplates} from '../lib/exploitation.js';

describe('test generate templates', () => {
    it('test 1', function() {
        console.log(generateTemplates({split: [',', '.'], include: ['[', '$']}));
    })
});