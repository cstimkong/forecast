# connie-lang

Configuration language for [connie](https://github.com/mattinsler/connie).

## Installation

```bash
$ npm install --save connie-lang
```

## Usage

```javascript
var ConnieLang = require('connie-lang');

var config = ConnieLang.parse({
  common: {
    domain: 'mattinsler.com'
  },
  endpoints: {
    api: 'api.@{common.domain}'
  },
  server: {
    port: '${PORT:3000}'
  }
}, process.env);

```

## Language Reference

**${ENV_VAR}** Environment Variable Replacement

**@{ref}** Self-Reference Replacement

### Default Values

You can provide a default value in either of the patterns above, using `:` as
a separator.

For instance, `${PORT:3000}` means to substitute the PORT
environment variable, but if that does not exist, it will return the string
`'3000'` instead. This also works with reference patterns, like
`@{common.domain:foo.com}`, which will use `'foo.com'` as the default value
if `common.domain` does not exist in the current config.

## Examples

##### original config object
```json
{
  "common": {
    "domain": "mattinsler.com"
  },
  "endpoints": {
    "api": "api.@{common.domain}"
  },
  "server": {
    "port": "${PORT:3000}"
  }
}
```

When this configuration is executed with an empty environment, the result is:

##### parsed config object
```json
{
  "common": {
    "domain": "mattinsler.com"
  },
  "endpoints": {
    "api": "api.mattinsler.com"
  },
  "server": {
    "port": "3000"
  }
}
```

However, if the PORT environment variable is set to 4000, then this would change to:

##### parsed config object
```json
{
  "common": {
    "domain": "mattinsler.com"
  },
  "endpoints": {
    "api": "api.mattinsler.com"
  },
  "server": {
    "port": "4000"
  }
}
```
