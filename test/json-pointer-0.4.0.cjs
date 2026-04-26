(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsonPointer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var each=require("foreach");function api(r,e,i){if(3===arguments.length)return api.set(r,e,i);if(2===arguments.length)return api.get(r,e);var a=api.bind(api,r);for(var t in api)api.hasOwnProperty(t)&&(a[t]=api[t].bind(a,r));return a}module.exports=api,api.get=function(r,e){for(var i,a=Array.isArray(e)?e:api.parse(e);a.length;){if(i=a.shift(),"object"!=typeof r||!(i in r))throw new Error("Invalid reference token: "+i);r=r[i]}return r},api.set=function(r,e,i){for(var a,t=Array.isArray(e)?e:api.parse(e),n=t[0];t.length>1;)"-"===(a=t.shift())&&Array.isArray(r)&&(a=r.length),n=t[0],a in r||(n.match(/^(\d+|-)$/)?r[a]=[]:r[a]={}),r=r[a];return"-"===n&&Array.isArray(r)&&(n=r.length),r[n]=i,this},api.remove=function(r,e){var i=Array.isArray(e)?e:api.parse(e),a=i.pop();if(void 0===a)throw new Error('Invalid JSON pointer for remove: "'+e+'"');delete api.get(r,api.compile(i))[a]},api.dict=function(r,e){var i={};return api.walk(r,function(r,e){i[e]=r},e),i},api.walk=function(r,e,i){var a=[];i=i||function(r){var e=Object.prototype.toString.call(r);return"[object Object]"===e||"[object Array]"===e},function r(t){each(t,function(t,n){a.push(String(n)),i(t)?r(t):e(t,api.compile(a)),a.pop()})}(r)},api.has=function(r,e){try{api.get(r,e)}catch(r){return!1}return!0},api.escape=function(r){return r.toString().replace(/~/g,"~0").replace(/\//g,"~1")},api.unescape=function(r){return r.replace(/~1/g,"/").replace(/~0/g,"~")},api.parse=function(r){if(""===r)return[];if("/"!==r.charAt(0))throw new Error("Invalid JSON pointer: "+r);return r.substring(1).split(/\//).map(api.unescape)},api.compile=function(r){return 0===r.length?"":"/"+r.map(api.escape).join("/")};

},{"foreach":2}],2:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}]},{},[1])(1)
});
