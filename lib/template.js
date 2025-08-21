
/**
 * 
 * This file is part of FesaJS
 */

'use strict';

const { makeRandomId, randomChoice } = require('./helper');
/**
 * 
 * @param {String | Array<String>} grammarType 
 * @returns {String}
 */
function generateTemplateString(grammarType) {
    if (Array.isArray(grammarType)) {
        let funcs = [];
        for (let t of grammarType) {
            funcs.push(function() { return generateTemplateString(t); });
        }
        return randomChoice(funcs);
    }
    
    if (grammarType === 'any') {
        let funcs = [];
        for (let t of ['normalstring', 'url', 'filepath', 'querystring', 'split', 'surroundedtext', 'toml', 'yaml', 'xml']) {
            funcs.push(function() { return generateTemplateString(t); });
        }
        return randomChoice(funcs);
    }

    else if (grammarType === 'normalstring') {
        return `{${makeRandomId()}}`;
    }

    else if (grammarType === 'url') {
        return randomChoice([
            function() {
                return `http://${generateTemplateString(['normalstring', 'split'])}/{${makeRandomId()}}`;
            },
            function() {
                return `file:///{${makeRandomId()}}/{${makeRandomId()}}/{${makeRandomId()}}`;
            },
            function() {
                return `http://{${makeRandomId()}}/{${makeRandomId()}}?{${generateTemplateString('querystring')}}`;
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
                return `/${generateTemplateString(['normalstring', 'split'])}/${generateTemplateString(['normalstring', 'split'])}/${generateTemplateString(['normalstring', 'split'])}`;
            },
            function() {
                return `/${generateTemplateString(['normalstring', 'split'])}/${generateTemplateString(['normalstring', 'split'])}/${generateTemplateString(['normalstring', 'split'])}/`;
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

    else if (grammarType === 'surroundedtext') {
        return randomChoice([
            function() { return `[{${makeRandomId()}}]`; },
            function() { return `({${makeRandomId()}})`; },
            function() { return `\\{${makeRandomId()}\\}`; }
        ]);
    }

    else if (grammarType === 'toml') {
        return randomChoice([
            function() {
                return `[{${makeRandomId()}}]\n${generateTemplateString(['normalstring', 'split'])} = {${makeRandomId()}}`;
            },
            function() {
                return `[{${makeRandomId()}}]\n${generateTemplateString(['normalstring', 'split'])} = [{${makeRandomId()}}]`;
            },
        ]);
    }

    else if (grammarType === 'yaml') {
        return randomChoice([
            function() {
                return `{${makeRandomId()}}:\n  {${makeRandomId()}}: {${makeRandomId()}}`;
            },
            function() {
                return `---\n{${makeRandomId()}}:\n  {${makeRandomId()}}: {${makeRandomId()}}`;
            }
        ]);
    }
}


module.exports = { generateTemplateString };
