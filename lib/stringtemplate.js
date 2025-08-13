
/**
 * 
 * This file is part of FesaJS
 */

'use strict';

/**
 * 
 * @param {String | Array<String>} grammarType 
 * @returns 
 */
function generateStringTemplate(grammarType) {
    if (Array.isArray(grammarType)) {
        let funcs = [];
        for (let t of grammarType) {
            funcs.push(function() { return generateStringTemplate(t); });
        }
        return randomChoice(funcs);
    }

    if (grammarType === 'normalstring') {
        return `{${makeRandomId()}}`;
    }

    else if (grammarType === 'url') {
        return randomChoice([
            function() {
                return `http://${generateStringTemplate(['normalstring', 'split'])}/{${makeRandomid()}}`;
            },
            function() {
                return `file:///{${makeRandomId()}}/{${makeRandomId()}}/{${makeRandomId()}}`;
            },
            function() {
                return `http://{${makeRandomId()}}/{${makeRandomId()}}?{${generateStringTemplate('querystring')}}`;
            }
        ]);
    }

    else if (grammarType === 'querystring') {
        return randomChoice([
            function() {
                return `{${makeRandomId()}}={${makeRandomId()}}&{${makeRandomId()}}={${makeRandomId()}}`;
            }
        ])
    }
    else if (grammarType === 'filepath') {
        return randomChoice([
            function() {
                return `/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}`;
            },
            function() {
                return `/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}/${generateStringTemplate(['normalstring', 'split'])}/`;
            }
        ])
    }

    else if (grammarType === 'split') {
        return randomChoice([
            function() { return `{${makeRandomId()}}.{${makeRandomId()}}.{${makeRandomId()}}`; },
            function() { return `{${makeRandomId()}},{${makeRandomId()}},{${makeRandomId()}}`; },
            function() { return `{${makeRandomId()}}|{${makeRandomId()}}|{${makeRandomId()}}`; }
        ])
    }

    else if (grammarType === 'yaml') {
        
    }
}

module.exports = generateStringTemplate;