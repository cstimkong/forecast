# IniParser.js

ini style file parser for node

### install

```shell
npm i iniparserjs
```

### usage

`config.ini` file like:

```shell
gkey1=false
gkey2=true

[section1]
key1=value1
key2=value2

[section2]
key1=2
key2=value2
```

with IniParser:

```js
var path = require("path")
var IniParser = require("../index")

var config = new IniParser(path.join(__dirname, "test.ini"), "UTF8")

// get all sections
var sections = config.sections()

//get all keys of section1
var keysOfSection1 = config.keysOfSection("section1")

//get value by key and section
var valueOfkey1InSection2 = config.get("section2", "key1")

//reset a key-value
config.set("section2", "key2", "newValue2")
//set a new key-value
config.set("section3", "key1", "value1")

//resave
var opt = {
    path: path.join(__dirname, "new_config.ini"),
    encoding: "UTF8",  // default is "UTF8"
    toDelimiter: "="  // default is "="
}
config.save(opt)

//print
console.log("sections = ", sections)
console.log("keysOfSection1 = ", keysOfSection1)
console.log("valueOfkey1InSection2 = ", valueOfkey1InSection2)
console.log('all = ', config.configs)
```

output:

```shell
sections =  [ 'global', 'section1', 'section2' ]
keysOfSection1 =  [ 'key1', 'key2' ]
valueOfkey1InSection2 =  2
all =  { global: { gkey1: 'false', gkey2: 'true' },
  section1: { key1: 'value1', key2: 'value2' },
  section2: { key1: '2', key2: 'newValue2' },
  section3: { key1: 'value1' } }
```

`new_config.ini` file will like:

```shell
[global]
gkey1=false
gkey2=true

[section1]
key1=value1
key2=value2

[section2]
key1=2
key2=newValue2

[section3]
key1=value1
```

### test

```shell
npm run test
```
