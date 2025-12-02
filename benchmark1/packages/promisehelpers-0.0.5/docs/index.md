# PomiseHelpers





* * *

### PomiseHelpers.wrap(wrapperObject, propertyName) 

Takes a promise value and "wraps" it inside
 the wrapperObject passed to wrap, at the
 propertyName passed to wrap.

**Parameters**

**wrapperObject**: `object`, object on which you want the property stored

**propertyName**: `string`, key you want to store the subsequent value at on the wrapperObject

**Returns**: `function`, doWrap function with one argument: the value to be stored at propertyName on wrapperObject


### PomiseHelpers.notify(callback) 

Takes a function(funcA) passed to it and returns a new function
 which executes [funcA] and then returns whatever it was passed.

**Parameters**

**callback**: `function`, the function to be called

**Returns**: `function`, notifyWrapper calls the callback, and then returns whatever was passed to it


### PomiseHelpers.insert(key(s), insertable) 

Places a value in an object at an arbitrary depth
 specified by a keyPath.

**Parameters**

**key(s)**: `string | array`, either a single string, or an array of strings
 representing the key path at which the insertion should occur.

**insertable**: `value`, Places a value in an object at an arbitrary depth
 specified by a keyPath.

**Returns**: `function`, insertion helper which takes an object for inserting into


### PomiseHelpers.log(promise) 

log the promise value to the console

**Parameters**

**promise**: `value`, value

**Returns**: `value`, promise value



* * *










