keyd
----

A small library for using and manipulating key paths in JavaScript.

# Installation

````bash
npm install --save keyd
````

````javascript
const keyd = require('keyd');
````
    
# Getting / Setting Values

## Getting Values

````javascript
keyd(obj).get('my.keypath');
````

### Getting values in array and sub-arrays.

````javascript
keyd(obj).get.all('my.keypath');
````

## Setting Values

````javascript
keyd(obj).set('my.keypath', value);
````

# Manipulating Key Paths

## Components

````javascript
const components = keyd.components('my.key.path');
/* -> ['my','key','path'] */
````

> Throws an error if input is not a string.

## Joining

````javascript
const keyPath = keyd.join(['my','key','path']);
/* -> 'my.key.path' */
````

> Throws an error if input is not an array.

## Appending Keys

````javascript
const keyPath = keyd.append('my.key', 'path');
/* -> 'my.key.path' */
````

or

````javascript
const keyPath = keyd.append('my', ['key', 'path']);
/* -> 'my.key.path' */
````

> Both inputs can be either strings or arrays.

## Last

### Getting

````javascript
const lastComponent = keyd.last('my.key.path');
/* -> 'path' */
````

> Input can be a string or an array.

### Removing

````javascript
const keyPath = keyd.eatLast('my.key.path');
/* -> 'my.key' */
````

> Input can be a string or an array.

## First

### Getting

````javascript
const firstComponent = keyd.first('my.key.path');
/* -> 'my' */
````

> Input can be a string or an array.

### Removing

````javascript
const keyPath = keyd.eatFirst('my.key.path');
/* -> 'key.path' */
````

or

````javascript
const keyPath = keyd.eatFirst('my.key.path', 'my.key');
/* -> 'path' */
````

> Input can be a string or an array.

> Latter example with throw an error if second key path is not within the first.

## Match

````javascript
const within = keyd.within('my.key.path', 'my.key');
/* -> true */
````

> Both inputs can be either strings or arrays.

# Options

All methods supports options, which is provided as an object as the last parameter.

The table below shows the supported key(s).

| Name | Default value | Description | 
|:-----|:--------------|:------------|
| `separator` | `.` | A string that represents the separation characters of keys in a key path string.

# License

MIT (see LICENSE).
