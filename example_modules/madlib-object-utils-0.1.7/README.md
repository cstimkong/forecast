# madlib-object-utils
[![Build Status](https://travis-ci.org/Qwerios/madlib-object-utils.svg?branch=master)](https://travis-ci.org/Qwerios/madlib-object-utils)  [![NPM version](https://badge.fury.io/js/madlib-object-utils.png)](http://badge.fury.io/js/madlib-object-utils) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/madlib-object-utils.png?downloads=true&stars=true)](https://nodei.co/npm/madlib-object-utils.png?downloads=true&stars=true)

A small set of utility functions for working with objects


## acknowledgments
The Marviq Application Development library (aka madlib) was developed by me when I was working at Marviq. They were cool enough to let me publish it using my personal github account instead of the company account. We decided to open source it for our mutual benefit and to ensure future updates should I decide to leave the company.


## philosophy
JavaScript is the language of the web. Wouldn't it be nice if we could stop having to rewrite (most) of our code for all those web connected platforms running on JavaScript? That is what madLib hopes to achieve. The focus of madLib is to have the same old boring stuff ready made for multiple platforms. Write your core application logic once using modules and never worry about the basics stuff again. Basics including XHR, XML, JSON, host mappings, settings, storage, etcetera. The idea is to use the tried and proven frameworks where available and use madlib based modules as the missing link.

Currently madLib is focused on supporting the following platforms:

* Web browsers (IE6+, Chrome, Firefox, Opera)
* Appcelerator/Titanium
* PhoneGap
* NodeJS


## installation
```bash
$ npm install madlib-object-utils --save
```

## usage
```javascript
var objectUtils = require( "madlib-object-utils" )

var myObject     =
{
    books:
    {
        book: [
            "Example book 1",
            "Example book 2"
        ]
    }
}

// Retrieve a value from an object
// Will return 'Example book 1'
// 3rd parameter will be return if the path can't be found
//
book1Name = objectUtils.getValue( "books.book.0", myObject, "unknown" )

// Set a value on an object
// Will update 'Example book 2' to 'Example book 2a'
//
objectUtils.setValue( "books.book.1", myObject, "Example book 2a" )

// Retrieve a value from an object and creates is if it doesn't exist
//
book3 = objectUtils.getAndCreate( "books.book.2", myObject, "Example book 3" )

// Check if something is an array
//
books = objectUtils.getValue( "books.book", myObject )
if ( objectUtils.isArray( books ) )
{
    books.push( "Example book 4" )
}
```