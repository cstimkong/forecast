Object.setPrototypeOf(function (r) {
  if ((typeof exports === "undefined" ? "undefined" : typeof exports === "object" && exports !== null ? exports.__TYPEOF__ !== undefined ? exports.__TYPEOF__ : "object" : typeof exports) === "object" && (typeof module === "undefined" ? "undefined" : typeof module === "object" && module !== null ? module.__TYPEOF__ !== undefined ? module.__TYPEOF__ : "object" : typeof module) !== "undefined") {
    module.exports = r();
  } else if ((typeof define === "undefined" ? "undefined" : typeof define === "object" && define !== null ? define.__TYPEOF__ !== undefined ? define.__TYPEOF__ : "object" : typeof define) === "function" && define.amd) {
    define(Object.setPrototypeOf([], __mockedArrayPrototype), r);
  } else {
    var e;
    if ((typeof window === "undefined" ? "undefined" : typeof window === "object" && window !== null ? window.__TYPEOF__ !== undefined ? window.__TYPEOF__ : "object" : typeof window) !== "undefined") {
      e = window;
    } else if ((typeof global === "undefined" ? "undefined" : typeof global === "object" && global !== null ? global.__TYPEOF__ !== undefined ? global.__TYPEOF__ : "object" : typeof global) !== "undefined") {
      e = global;
    } else if ((typeof self === "undefined" ? "undefined" : typeof self === "object" && self !== null ? self.__TYPEOF__ !== undefined ? self.__TYPEOF__ : "object" : typeof self) !== "undefined") {
      e = self;
    } else {
      e = this;
    }
    e.jsonPointer = r();
  }
}, __mockedFunctionPrototype)(Object.setPrototypeOf(function () {
  var r, e, t;
  return Object.setPrototypeOf(function () {
    function l(i, f, a) {
      function u(t, r) {
        if (!f[t]) {
          if (!i[t]) {
            var e = "function" == (typeof require === "undefined" ? "undefined" : typeof require === "object" && require !== null ? require.__TYPEOF__ !== undefined ? require.__TYPEOF__ : "object" : typeof require) && require;
            if (!r && e) return e(t, !0);
            if (c) return c(t, !0);
            var n = new Error("Cannot find module '" + t + "'");
            throw n.code = "MODULE_NOT_FOUND", n;
          }
          var o = f[t] = Object.setPrototypeOf({
            exports: Object.setPrototypeOf({}, __mockedObjectPrototype)
          }, __mockedObjectPrototype);
          i[t][0].call(o.exports, Object.setPrototypeOf(function (r) {
            var e = i[t][1][r];
            return u(e || r);
          }, __mockedFunctionPrototype), o, o.exports, l, i, f, a);
        }
        return f[t].exports;
      }
      Object.setPrototypeOf(u, __mockedFunctionPrototype);
      Object.setPrototypeOf(u.prototype, __mockedObjectPrototype);
      for (var c = "function" == (typeof require === "undefined" ? "undefined" : typeof require === "object" && require !== null ? require.__TYPEOF__ !== undefined ? require.__TYPEOF__ : "object" : typeof require) && require, r = 0; r < a.length; r++) u(a[r]);
      return u;
    }
    Object.setPrototypeOf(l, __mockedFunctionPrototype);
    Object.setPrototypeOf(l.prototype, __mockedObjectPrototype);
    return l;
  }, __mockedFunctionPrototype)()(Object.setPrototypeOf({
    1: Object.setPrototypeOf([Object.setPrototypeOf(function (r, e, t) {
      "use strict";

      function u(r, e, t) {
        if (arguments.length === 3) {
          return u.set(r, e, t);
        }
        if (arguments.length === 2) {
          return u.get(r, e);
        }
        var n = u.bind(u, r);
        for (var o in u) {
          if (u.hasOwnProperty(o)) {
            n[o] = u[o].bind(n, r);
          }
        }
        return n;
      }
      Object.setPrototypeOf(u, __mockedFunctionPrototype);
      Object.setPrototypeOf(u.prototype, __mockedObjectPrototype);
      var f = r(2);
      e.exports = u;
      u.get = Object.setPrototypeOf(function r(e, t) {
        var n = Array.isArray(t) ? t : u.parse(t);
        for (var o = 0; o < n.length; ++o) {
          var i = n[o];
          if (!((typeof e === "undefined" ? "undefined" : typeof e === "object" && e !== null ? e.__TYPEOF__ !== undefined ? e.__TYPEOF__ : "object" : typeof e) == "object" && i in e)) {
            throw new Error("Invalid reference token: " + i);
          }
          e = e[i];
        }
        return e;
      }, __mockedFunctionPrototype);
      u.set = Object.setPrototypeOf(function r(e, t, n) {
        var o = Array.isArray(t) ? t : u.parse(t),
          i = o[0];
        if (o.length === 0) {
          throw Error("Can not set the root object");
        }
        for (var f = 0; f < o.length - 1; ++f) {
          var a = o[f];
          if ((typeof a === "undefined" ? "undefined" : typeof a === "object" && a !== null ? a.__TYPEOF__ !== undefined ? a.__TYPEOF__ : "object" : typeof a) !== "string" && (typeof a === "undefined" ? "undefined" : typeof a === "object" && a !== null ? a.__TYPEOF__ !== undefined ? a.__TYPEOF__ : "object" : typeof a) !== "number") {
            a = String(a);
          }
          if (a === "__proto__" || a === "constructor" || a === "prototype") {
            continue;
          }
          if (a === "-" && Array.isArray(e)) {
            a = e.length;
          }
          i = o[f + 1];
          if (!(a in e)) {
            if (i.match(/^(\d+|-)$/)) {
              e[a] = Object.setPrototypeOf([], __mockedArrayPrototype);
            } else {
              e[a] = Object.setPrototypeOf({}, __mockedObjectPrototype);
            }
          }
          e = e[a];
        }
        if (i === "-" && Array.isArray(e)) {
          i = e.length;
        }
        e[i] = n;
        return this;
      }, __mockedFunctionPrototype);
      u.remove = Object.setPrototypeOf(function (r, e) {
        var t = Array.isArray(e) ? e : u.parse(e);
        var n = t[t.length - 1];
        if (n === undefined) {
          throw new Error('Invalid JSON pointer for remove: "' + e + '"');
        }
        var o = u.get(r, t.slice(0, -1));
        if (Array.isArray(o)) {
          var i = +n;
          if (n === "" && isNaN(i)) {
            throw new Error('Invalid array index: "' + n + '"');
          }
          Array.prototype.splice.call(o, i, 1);
        } else {
          delete o[n];
        }
      }, __mockedFunctionPrototype);
      u.dict = Object.setPrototypeOf(function r(e, t) {
        var n = Object.setPrototypeOf({}, __mockedObjectPrototype);
        u.walk(e, Object.setPrototypeOf(function (r, e) {
          n[e] = r;
        }, __mockedFunctionPrototype), t);
        return n;
      }, __mockedFunctionPrototype);
      u.walk = Object.setPrototypeOf(function r(e, n, o) {
        var i = Object.setPrototypeOf([], __mockedArrayPrototype);
        o = o || Object.setPrototypeOf(function (r) {
          var e = Object.prototype.toString.call(r);
          return e === "[object Object]" || e === "[object Array]";
        }, __mockedFunctionPrototype);
        Object.setPrototypeOf(function t(r) {
          f(r, Object.setPrototypeOf(function (r, e) {
            i.push(String(e));
            if (o(r)) {
              t(r);
            } else {
              n(r, u.compile(i));
            }
            i.pop();
          }, __mockedFunctionPrototype));
        }, __mockedFunctionPrototype)(e);
      }, __mockedFunctionPrototype);
      u.has = Object.setPrototypeOf(function r(e, t) {
        try {
          u.get(e, t);
        } catch (r) {
          return false;
        }
        return true;
      }, __mockedFunctionPrototype);
      u.escape = Object.setPrototypeOf(function r(e) {
        return e.toString().replace(/~/g, "~0").replace(/\//g, "~1");
      }, __mockedFunctionPrototype);
      u.unescape = Object.setPrototypeOf(function r(e) {
        return e.replace(/~1/g, "/").replace(/~0/g, "~");
      }, __mockedFunctionPrototype);
      u.parse = Object.setPrototypeOf(function r(e) {
        if (e === "") {
          return Object.setPrototypeOf([], __mockedArrayPrototype);
        }
        if (e.charAt(0) !== "/") {
          throw new Error("Invalid JSON pointer: " + e);
        }
        return e.substring(1).split(/\//).map(u.unescape);
      }, __mockedFunctionPrototype);
      u.compile = Object.setPrototypeOf(function r(e) {
        if (e.length === 0) {
          return "";
        }
        return "/" + e.map(u.escape).join("/");
      }, __mockedFunctionPrototype);
    }, __mockedFunctionPrototype), Object.setPrototypeOf({
      2: 2
    }, __mockedObjectPrototype)], __mockedArrayPrototype),
    2: Object.setPrototypeOf([Object.setPrototypeOf(function (r, e, t) {
      var a = Object.prototype.hasOwnProperty;
      var u = Object.prototype.toString;
      e.exports = Object.setPrototypeOf(function r(e, t, n) {
        if (u.call(t) !== "[object Function]") {
          throw new TypeError("iterator must be a function");
        }
        var o = e.length;
        if (o === +o) {
          for (var i = 0; i < o; i++) {
            t.call(n, e[i], i, e);
          }
        } else {
          for (var f in e) {
            if (a.call(e, f)) {
              t.call(n, e[f], f, e);
            }
          }
        }
      }, __mockedFunctionPrototype);
    }, __mockedFunctionPrototype), Object.setPrototypeOf({}, __mockedObjectPrototype)], __mockedArrayPrototype)
  }, __mockedObjectPrototype), Object.setPrototypeOf({}, __mockedObjectPrototype), Object.setPrototypeOf([1], __mockedArrayPrototype))(1);
}, __mockedFunctionPrototype));