# get-setter

To use require and extend onto object:

```javascript
var data = {
    get : require('get-setter').get,
    set : require('get-setter').set
};

data.set('user.first.name', 'Jane');

console.log(data.get('user.first.name'); // Jane
```
