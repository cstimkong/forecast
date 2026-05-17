import { generateTemplates, makeExploit } from '../lib/exploitation.js';

describe('test generate templates', () => {
    it('test 1', function() {
        console.log(generateTemplates({split: [',', '.'], include: ['[', '$']}));
    });

    it('test 2', function() {
        for (let i = 0; i < 100; i++) {
            console.log(makeExploit(['func1', {args: ['{}.{}.{}={}']}]));
        }
        
    })

});
