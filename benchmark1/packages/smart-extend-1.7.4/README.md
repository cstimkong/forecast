# smart-extend
[![Build Status](https://travis-ci.org/danielkalen/smart-extend.svg?branch=master)](https://travis-ci.org/danielkalen/smart-extend)
[![Coverage](.config/badges/coverage.png?raw=true)](https://github.com/danielkalen/smart-extend)
[![Code Climate](https://codeclimate.com/github/danielkalen/smart-extend/badges/gpa.svg)](https://codeclimate.com/github/danielkalen/smart-extend)
[![NPM](https://img.shields.io/npm/v/smart-extend.svg)](https://npmjs.com/package/smart-extend)
[![NPM](https://img.shields.io/npm/dm/smart-extend.svg)](https://npmjs.com/package/smart-extend)

`smart-extend` is an extension to jQuery's classic `extend()` method with additional features providing you with more power and control over your object extensions/clones. Works in both Node.JS and the browser.

## Highlights
- Deep/shallow object cloning/extension.
- Optional array concatination.
- Optionally copy only 'own' properties.
- Specify specific properties to copy.
- Apply filter functions to allow only specific properties/values to be copied.
- Expressive API.
- Clean, Focused, and actively maintained.

# Table of Contents
- [Highlights](#highlights)
- [Example Usage](#example-usage)
- [Usage](#usage)
  - [Options](#options)
      - [own](#own)
      - [deep](#deep)
      - [notDeep()](#notdeeparrayobject)
      - [deepOnly()](#deeponlyarrayobject)
      - [allowNull](#allownull)
      - [nullDeletes](#nulldeletes)
      - [clone](#clone)
      - [concat](#concat)
      - [keys](#keysarrayobject)
      - [notKeys()](#notkeysarrayobject)
      - [transform()](#transformtransformfunctiontransformmap)
      - [filter()](#filterfilterfunctionfiltermap)

# Example Usage
```javascript
var extend = require('smart-extend');
var objA = {a:1, b:2};
var objB = {b:3, c:4};
var objC = {a:1, b:2, inner:{a:1, b:2}};
var objD = {b:3, c:4, inner:{b:3, c:4}};
var emptyObj = {};

// Copy objA into emptyObj
extend(emptyObj, objA)          //-> emptyObj === {a:1, b:2} 

// Copy objA & objB into emptyObj
extend(emptyObj, objA, objB)    //-> emptyObj === {a:1, b:3, c:4} 

// Shallow Copy objC & objD into a new object
extend({}, objC, objD)          //-> {a:1, b:3, c:4, inner:{b:3, c:4}} 

// Deep Copy objC & objD into a new object
extend.deep({}, objC, objD)     //-> {a:1, b:3, c:4, inner:{a:1, b:3, c:4}} 

// Clone objA (without specifying a target)
extend.clone(objA)              //-> {a:1, b:2}

// Clone objA with only property 'a'
extend.clone.keys(['a'])(objA)  //-> {a:1}

// Clone objC with properties named 'a' or 'inner'
extend.clone.keys(['a','inner'])(objC)  //-> {a:1, inner:{a:1}}

// Copy objA's & objB's properties that have a value greater than 2
extend.filter(value => value > 2)({}, objA, objB) //-> {b:3, c:4}

// Concat array values
extend({}, {arr:[1,2,3]}, {arr:[4,5,6]})        //-> {arr: [4,5,6]}
extend.concat({}, {arr:[1,2,3]}, {arr:[4,5,6]}) //-> {arr: [1,2,3,4,5,6]}

// And more...
```


# Usage
#### `extend(target, object1[, objectN...])`
Shallow copy all properties (own & inherited) of `object1` and any following objects into `target`.

#### `extend[.<option>[.<option>...]](...)`
Perform copy/extension with the specified [options](#options). `options` can be chained in any desired order and some accept arguments.

**Example**:
`extend.keys(['a', 'b']).clone.deep(targetObject)` will deep clone `targetObject`'s `'a'` and `'b'` properties.


## Options
#### `own`
Only copies 'own' properties of object and not inherited properties.

**Example**:
```javascript
var SomeConstructor = function(){this.a = 1; this.b = 2;}
SomeConstructor.prototype.inherited = 'abc'
var object = new SomeConstructor();

extend({}, object)      //-> {a:1, b:2, inherited:'abc'}
extend.own({}, object)  //-> {a:1, b:2}
```


#### `deep`
Performs a recursive copy of the specified objects.

**Example**:
```javascript
var objA = {a:1, b:2, inner:{a:1, b:2}};
var objB = {b:3, c:4, inner:{b:3, c:4}};
var cloneA = extend({}, objA);
var cloneB = extend.deep({}, objA);

cloneA === objA //-> false
cloneA.inner === objA.inner //-> true
cloneB.inner === objA.inner //-> false

extend({}, objA, objB)      //-> {a:1, b:3, c:4, inner:{b:3, c:4}}
extend.deep({}, objA, objB) //-> {a:1, b:3, c:4, inner:{a:1, b:3, c:4}}
```


#### `notDeep(array|object)`
When paired with [`.deep`](#deep) it performs a recursive copy of the specified objects while performing a shallow copy for the provided keys.

**Example**:
```javascript
var objA = {one:{a:1, b:2}, two:{a:1, b:2}};
var objB = {one:{b:3, c:4}, two:{b:3, c:4}};
var clone = extend.deep.notDeep(['two'])({}, objA, objB);

clone.one === objB.one //-> false
clone.two === objB.two //-> true
clone //-> {one:{a:1, b:3, c:4}, two:{b:3, c:4}};
```


#### `deepOnly(array|object)`
When paired with [`.deep`](#deep) it performs a recursive copy of the specified objects while performing a shallow copy for the provided keys.

**Example**:
```javascript
var objA = {one:{a:1, b:2}, two:{a:1, b:2}};
var objB = {one:{b:3, c:4}, two:{b:3, c:4}};
var clone = extend.deep.deepOnly(['two'])({}, objA, objB);

clone.one === objB.one   //-> true
clone.two === objB.two   //-> false
clone                    //-> {one:{b:3, c:4}, two:{a:1, b:3, c:4}};
```


#### `allowNull`
Allows `null` values to be copied over.

**Example**:
```javascript
var object = {a:1, b:null, c:3};

extend({}, object)            //-> {a:1, c:3}
extend.allowNull({}, object)  //-> {a:1, b:null, c:3}
```


#### `nullDeletes`
Encounters of `null` values in the source object will delete/remove the associated key in the target object.

**Example**:
```javascript
var object = {nested:{a:1, b:2, c:3}, c:3};
var deletes = {nested{a:10}, c:null};

extend({}, object, deletes)                  //-> {nested:{a:10}, c:3}
extend.nullDeletes({}, object, deletes)      //-> {nested:{a:10}}
extend.nullDeletes.deep({}, object, deletes) //-> {nested:{a:10, b:2, c:3}}
```


#### `clone`
Clone the specified objects without specifying a target. This is basically a shortcut in which instead of passing an empty object as the first argument (i.e. the target object), an empty object will be created internally for you.

**Example**:
```javascript
// Both will render the same results
var A = extend({}, {a:1}, {b:2})   //-> {a:1, b:2}
var B = extend.clone({a:1}, {b:2}) //-> {a:1, b:2}
```


#### `concat`
Causes array properties to be merged/concatenated instead of the usual behavior in which the 2nd array replaces the first. Behaves the same in both deep & shallow copies.

**Example**:
```javascript
var objA = {arr: [1,2,3]};
var objB = {arr: [4,5,6]};
var objB2 = {arr: [null,4,5,6]};
extend({}, objA, objB)        //-> {arr: [4,5,6]}
extend.concat({}, objA, objB) //-> {arr: [1,2,3,4,5,6]}

extend({}, objA, objB2)       //-> {arr: [null,4,5,6]}
extend.deep({}, objA, objB2)  //-> {arr: [1,4,5,6]}
extend.deep.concat({}, objA, objB2)  //-> {arr: [1,2,3,4,5,6]}
```


#### `keys(array|object)`
Allows only properties whose name is included in the provided array. If a plain object is passed its keys/property names will be extracted into an array *(disregarding the property values)*.

**Example**:
```javascript
var objA = {a:1, b:2};
var objB = {b:3, c:4, d:5};

extend({}, objA, objB)                         //-> {a:1, b:3, c:4, d:5}
extend.keys(['a', 'c'])({}, objA, objB)        //-> {a:1, c:4}
extend.keys({b:true, d:false})({}, objA, objB) //-> {b:3, d:5}
```


#### `notKeys(array|object)`
Same as `keys`, but instead excludes and keys matching the one of the keys provided in the array/object.

**Example**:
```javascript
var objA = {a:1, b:2};
var objB = {b:3, c:4, d:5};

extend({}, objA, objB)                            //-> {a:1, b:3, c:4, d:5}
extend.notKeys(['b', 'd'])({}, objA, objB)        //-> {a:1, c:4}
extend.notKeys({a:true, c:false})({}, objA, objB) //-> {b:3, d:5}
```

#### `transform(transformFunction|transformMap)`
Runs the provided `transformFunction` on each property encoutered in the provided sources with the following arguments: `transformFunction(value, key, source)`. The value returned from the `transformFunction` will be used instead of the original value regardless if the transformed value is equal to `undefined`, `null`, or anything else. If provided a filter, transforms will be invoked only for properties that passed the filter predicate.

A `transformMap` object can be passed instead of a single function which is an object with the signature of `{property: transformFunction}`. When iterating through the source's properties, if there is a function predicate matching the currently processed property's name then it will be invoked and treated like a `filterFunction`.

Arguments:
- `transformFunction` - a transform function to apply to each property encoutered in the source objects (i.e. the objects we are extending/copying).
    - `value` - The value of the current property being processed in the object.
    - `key` - The the name (or label) of the current property being processed in the object.
    - `source` - The object which this property belongs to.

**Example (transformFunction)**:
```javascript
var objA = {a:'a1', b:'b2'};
var objB = {b:'b3', c:'c4'};
var myTransform = function(value){return value.toUpperCase()}

extend.transform(myTransform)({}, objA, objB) //-> {a:'A1', b:'B3', c:'C4'}
```

**Example (transformMap)**:
```javascript
var objA = {a:'a1', b:'b2'};
var objB = {b:'b3', c:'c4'};

extend.transform({
    a: (value) => value.toUpperCase()
    c: (value) => value.toUpperCase()+'!'
})({}, objA, objB)
//-> {a:'A1', b:'b3', c:'C4!'}
```


#### `filter(filterFunction|filterMap)`
Runs the provided `filterFunction` on each property encoutered in the provided sources with the following arguments: `filterFunction(value, key, source)`. The value returned from the `filterFunction` will be used to determine whether or not to copy the subject property - if the value is a truthy value the value property will be copied and if the value is a falsey value it will be omitted. 

A `filterMap` object can be passed instead of a single function which is an object with the signature of `{property: filterFunction}`. When iterating through the source's properties, if there is a function predicate matching the currently processed property's name then it will be invoked and treated like a `filterFunction`.

Arguments:
- `filterFunction` - a filter predicate to apply to each property encoutered. Return `true` to copy the property, otherwise return `false` to not copy the property.
    - `value` - The value of the current property being processed in the object.
    - `key` - The the name (or label) of the current property being processed in the object.
    - `source` - The object which this property belongs to.

**Example (filterFunction)**:
```javascript
var objA = {a:1, b:10};
var objB = {b:3, c:4, d:5};
var myFilter = function(value){return value > 3};

extend.filter(myFilter)({}, objA, objB) //-> {b:10, c:4, d:5}
```

**Example (filterMap)**:
```javascript
var objA = {a:1, b:5, c:3};
var objB = {a:3, b:2, c:5, e:0};
var objC = {a:10, b:'20', c:30, d:40};

extend.filter({
    a: (value) => value < 2
    b: (value) => typeof value === 'string'
    c: (value) => value < 10
    e: (value) => value > 0
})(objA, objB, objC)
//-> {a:1, b:'20', c:5, d:40}
```



## License
MIT © [Daniel Kalen](https://github.com/danielkalen)
