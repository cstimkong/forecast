# set-deep-prop
Sets the value for a deeply nested objects and arrays.

## Example
```
const setDeepProp = require('set-deep-prop')

const obj = {
  order: {
    number: 123,
    items: [
      {
        sku: 1,
        description: 'shirt',
      },
      {
        sku: 2,
        description: 'pants'
      }
    ]
  }
}

setDeepProp(obj, ['order', 'items', 1, 'description'], 'hat')
console.log(obj.order.items[1].description) // 'hat'

```

See test/set-deep-prop.test.js for more examples.

## Installation
```
npm install --save set-deep-prop
```

## API
```
setDeepProp(obj, path, value)
@param {object} obj -- A deeply nested object
@param {array} path -- The path to the object as an array. Ex: ['topkey', 'nextkey', 0, 'nestedKey']
@param {any} value -- The new value to set.

@return {object} -- The updated object. Note that this method mutates the original object.
```

## Test
```
npm test
```

## License
MIT
