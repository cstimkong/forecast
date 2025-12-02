# deep-setter
sets a value deep in an object

[![npm version](https://badge.fury.io/js/deep-setter.svg)](https://badge.fury.io/js/deep-setter) [![dependencies](https://david-dm.org/arupex/deep-setter.svg)](http://github.com/arupex/deep-setter) ![Build Status](https://api.travis-ci.org/arupex/deep-setter.svg?branch=master) <a href='https://pledgie.com/campaigns/31873'><img alt='Pledge To Arupex!' src='https://pledgie.com/campaigns/31873.png?skin_name=chrome' border='0' ></a>


#Install

    npm install deep-setter --save

#Usage

    var setter = require('deep-setter');
    //setter is a function that takes (originObject, deepValueAnnotation, value)

If You:

    setter({}, 'an.[@1].arbitrary.[@0].address', 'value')

Result:

    { an : [, { arbitrary : [ { address : 'value'} ] } ] } );

___


If You:

    setter({}, 'an.1.arbitrary.0.address', 'value')

Result:

     { an : { 1 : { arbitrary : { 0 : { address : 'value'} } } } } );

___


If You:

    setter({}, 'an.arbitrary.address', { test : 'value'})

Result:

    { an : { arbitrary : { address : { test : 'value' }} } } );
