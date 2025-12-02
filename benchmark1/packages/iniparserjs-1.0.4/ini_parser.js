var fs = require("fs")

var sectionNameRegex = /\[(.*)]$/;
var comments = [";", "#"]
var delimiter = ["=", ":"]

function IniParser(path, encoding) {
    this.path = path
    this.encoding = encoding || "UTF8"
    this.configs = {}
    // var contents = []
    if (this.path) {
        if (!fs.existsSync(path)) {
            throw new Error(`file dons't exit: ${this.path}`)
        }
        try {
            this.input = fs.readFileSync(path, encoding)
        }catch (ex) {
            throw new Error(`open file failed: \n ex.toString()`)
        }
        var configLines = this.input.toString().split(/\r?\n/g)
        
        var curSection = 'global'
        this.configs[curSection] = {}
        // contents.push(rowContent('section', curSection, '', curSection))
        var globalCount = 0
        for (var i = 0; i < configLines.length; i ++) {
            var line = configLines[i].trim()
            if (line.length <= 2 || comments.includes(line.charAt(0))) {
                // contents.push(rowContent('comment', "", "", line))
                continue
            } 
            comments.forEach(function(com) { line = line.split(com)[0] })
            line = line.trim()
            if (line.length <= 2) {
                // contents.push(rowContent('comment', "", "", line))
                continue
            } 
            var matchArr = line.match(sectionNameRegex)
            if (line.startsWith('[') && matchArr != null) {
                curSection = matchArr[1]
                if (!(curSection in this.configs)) {
                    this.configs[curSection] = {}
                    // contents.push(rowContent('section', curSection, '', curSection))
                }
                continue
            }

            for (var j = 0; j < delimiter.length; j ++) {
                var curDelimiter = delimiter[j]
                if (!line.includes(curDelimiter)) {
                    continue
                }
                var index = line.indexOf(curDelimiter)
                if (index == line.length - 1) {
                    throw new Error(`there is no value with key ${line.slice(0, index)} in ${this.path} line ${i}`)
                }
                if (index == 0) {
                    throw new Error(`there is no key in ${this.path} line ${i}`)
                }
                var curKey = line.slice(0, index).trim()
                var curValue = line.slice(index + 1, line.length).trim()
                this.configs[curSection][curKey] = curValue
                // contents.push(rowContent('record', curSection, curKey, curValue))
                if (curSection == 'global') {
                    globalCount ++
                }
                break
            }
        }
        
        if (globalCount == 0) {
            delete this.configs.global
            // contents = contents.splice(0, 1)
        }
    }
    this.sections = function () {
        return Object.keys(this.configs)
    }

    this.get = function(section, key) {
        if (key == null) {
            key = section
            section = "global"
        }
        if (!this.sections().includes(section)) {
            throw new Error(`there is no section: ${section}`)
        }
        if (!Object.keys(this.configs[section]).includes(key)) {
            throw new Error(`there is no key: ${key} in section: ${section}`)
        }
        return this.configs[section][key]
    }

    this.set = function(section, key, value) {
        if (value == null) {
            value = key
            key = section
            section = 'global'
        }
        // var isNewSection = false
        if (!this.sections().includes(section)) {
            // isNewSection = true
            this.configs[section] = {}
            // contents.push(rowContent('section', section, '', section))
            // contents.push(rowContent('record', section, key, value))
        }
        this.configs[section][key] = value
        // console.log(contents)
        // if (!isNewSection) {
        //     var rowIdx = contents.findIndex(function(ele) {return (ele.type === 'record' && ele.section === section && ele.key === key)})
        //     if (rowIdx > -1) {
        //         contents[rowIdx][value] = value
        //     }else {
        //         var sectionIdx = contents.findIndex(function(ele) {return (ele.type === 'section' && ele.section === section)})
        //         if (sectionIdx == -1) {
        //             throw new Error(`no section: ${section}`)
        //         }
        //         if (sectionIdx == contents.length - 1) {
        //             contents.push('record', section, key, value)
        //         }else {
        //             contents.splice(sectionIdx + 1, 0, rowContent('record', section, key, value))
        //         }
        //     }
        // }
    }

    this.keysOfSection = function(section) {
        if (section == null) {
            section = 'global'
        }
        if (this.sections().includes(section)) {
            return Object.keys(this.configs[section])
        }else {
            return []
        }
    }

    this.stringfy = function(delimiter) {
        if (delimiter == null) {
            delimiter = '='
        }
        var result = ""
        for (var section of Object.keys(this.configs)) {
            result += "[" + section.toString() + "]\n"
            var curConfig = this.configs[section]
            for (var key of Object.keys(curConfig)) {
                result += key.toString() + delimiter + curConfig[key] + "\n"
            }
            result += "\n"
        }
        return result
    }

    this.save = function(opt) {
        var toPath = opt.path || this.path
        var toEncoding = opt.encoding || this.encoding
        var toDelimiter = opt.delimiter || '='
        var result = this.stringfy(toDelimiter)
        try {
            fs.writeFileSync(toPath, result, {encoding: toEncoding})
        }catch (ex) {
            throw new Error(ex.toString())
        }
    }
}

var rowContent = function(type, section, key, value) {
    return {
        type: type,
        section: section,
        key: key,
        value: value
    }
}

module.exports = IniParser