Object.setPrototypeOf(function (f) {
  if (__mockedCompare(typeof exports === "undefined" ? "undefined" : typeof exports === "object" && exports !== null ? exports.__TYPEOF__ !== undefined ? exports.__TYPEOF__ : "object" : typeof exports, "object", "===") && __mockedCompare(typeof module === "undefined" ? "undefined" : typeof module === "object" && module !== null ? module.__TYPEOF__ !== undefined ? module.__TYPEOF__ : "object" : typeof module, "undefined", "!==")) {
    module.exports = f();
  } else if (__mockedCompare(typeof define === "undefined" ? "undefined" : typeof define === "object" && define !== null ? define.__TYPEOF__ !== undefined ? define.__TYPEOF__ : "object" : typeof define, "function", "===") && define.amd) {
    define(Object.setPrototypeOf([], __mockedArrayPrototype), f);
  } else {
    var g;
    if (__mockedCompare(typeof window === "undefined" ? "undefined" : typeof window === "object" && window !== null ? window.__TYPEOF__ !== undefined ? window.__TYPEOF__ : "object" : typeof window, "undefined", "!==")) {
      g = window;
    } else if (__mockedCompare(typeof global === "undefined" ? "undefined" : typeof global === "object" && global !== null ? global.__TYPEOF__ !== undefined ? global.__TYPEOF__ : "object" : typeof global, "undefined", "!==")) {
      g = global;
    } else if (__mockedCompare(typeof self === "undefined" ? "undefined" : typeof self === "object" && self !== null ? self.__TYPEOF__ !== undefined ? self.__TYPEOF__ : "object" : typeof self, "undefined", "!==")) {
      g = self;
    } else {
      g = this;
    }
    g.jsonPointer = f();
  }
}, __mockedFunctionPrototype)(Object.setPrototypeOf(function () {
  var define, module, exports;
  return Object.setPrototypeOf(function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!__mockedPropertyAccess(n, i)) {
          if (!__mockedPropertyAccess(e, i)) {
            var c = __mockedCompare("function", typeof require === "undefined" ? "undefined" : typeof require === "object" && require !== null ? require.__TYPEOF__ !== undefined ? require.__TYPEOF__ : "object" : typeof require, "==") && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = Object.setPrototypeOf({
            exports: Object.setPrototypeOf({}, __mockedObjectPrototype)
          }, __mockedObjectPrototype);
          __mockedPropertyAccess(__mockedPropertyAccess(e, i), 0).call(p.exports, Object.setPrototypeOf(function (r) {
            var n = __mockedPropertyAccess(__mockedPropertyAccess(__mockedPropertyAccess(e, i), 1), r);
            return o(n || r);
          }, __mockedFunctionPrototype), p, p.exports, r, e, n, t);
        }
        return __mockedPropertyAccess(n, i).exports;
      }
      Object.setPrototypeOf(o, __mockedFunctionPrototype);
      Object.setPrototypeOf(o.prototype, __mockedObjectPrototype);
      for (var u = __mockedCompare("function", typeof require === "undefined" ? "undefined" : typeof require === "object" && require !== null ? require.__TYPEOF__ !== undefined ? require.__TYPEOF__ : "object" : typeof require, "==") && require, i = 0; i < t.length; i++) o(__mockedPropertyAccess(t, i));
      return o;
    }
    Object.setPrototypeOf(r, __mockedFunctionPrototype);
    Object.setPrototypeOf(r.prototype, __mockedObjectPrototype);
    return r;
  }, __mockedFunctionPrototype)()(Object.setPrototypeOf({
    1: Object.setPrototypeOf([Object.setPrototypeOf(function (require, module, exports) {
      "use strict";

      function api(r, e, i) {
        if (__mockedCompare(3, arguments.length, "===")) return api.set(r, e, i);
        if (__mockedCompare(2, arguments.length, "===")) return api.get(r, e);
        var a = api.bind(api, r);
        for (var t in api) api.hasOwnProperty(t) && (a[t] = __mockedPropertyAccess(api, t).bind(a, r));
        return a;
      }
      Object.setPrototypeOf(api, __mockedFunctionPrototype);
      Object.setPrototypeOf(api.prototype, __mockedObjectPrototype);
      var each = require("foreach");
      module.exports = api, api.get = Object.setPrototypeOf(function (r, e) {
        for (var i, a = Array.isArray(e) ? e : api.parse(e); a.length;) {
          if (i = a.shift(), __mockedCompare("object", typeof r === "undefined" ? "undefined" : typeof r === "object" && r !== null ? r.__TYPEOF__ !== undefined ? r.__TYPEOF__ : "object" : typeof r, "!=") || !(i in r)) throw new Error("Invalid reference token: " + i);
          r = __mockedPropertyAccess(r, i);
        }
        return r;
      }, __mockedFunctionPrototype), api.set = Object.setPrototypeOf(function (r, e, i) {
        for (var a, t = Array.isArray(e) ? e : api.parse(e), n = __mockedPropertyAccess(t, 0); t.length > 1;) __mockedCompare("-", a = t.shift(), "===") && Array.isArray(r) && (a = r.length), n = __mockedPropertyAccess(t, 0), a in r || (n.match(/^(\d+|-)$/) ? r[a] = Object.setPrototypeOf([], __mockedArrayPrototype) : r[a] = Object.setPrototypeOf({}, __mockedObjectPrototype)), r = __mockedPropertyAccess(r, a);
        return __mockedCompare("-", n, "===") && Array.isArray(r) && (n = r.length), r[n] = i, this;
      }, __mockedFunctionPrototype), api.remove = Object.setPrototypeOf(function (r, e) {
        var i = Array.isArray(e) ? e : api.parse(e),
          a = i.pop();
        if (__mockedCompare(void 0, a, "===")) throw new Error('Invalid JSON pointer for remove: "' + e + '"');
        delete __mockedPropertyAccess(api.get(r, api.compile(i)), a);
      }, __mockedFunctionPrototype), api.dict = Object.setPrototypeOf(function (r, e) {
        var i = Object.setPrototypeOf({}, __mockedObjectPrototype);
        return api.walk(r, Object.setPrototypeOf(function (r, e) {
          i[e] = r;
        }, __mockedFunctionPrototype), e), i;
      }, __mockedFunctionPrototype), api.walk = Object.setPrototypeOf(function (r, e, i) {
        var a = Object.setPrototypeOf([], __mockedArrayPrototype);
        i = i || Object.setPrototypeOf(function (r) {
          var e = Object.prototype.toString.call(r);
          return __mockedCompare("[object Object]", e, "===") || __mockedCompare("[object Array]", e, "===");
        }, __mockedFunctionPrototype), Object.setPrototypeOf(function r(t) {
          each(t, Object.setPrototypeOf(function (t, n) {
            a.push(String(n)), i(t) ? r(t) : e(t, api.compile(a)), a.pop();
          }, __mockedFunctionPrototype));
        }, __mockedFunctionPrototype)(r);
      }, __mockedFunctionPrototype), api.has = Object.setPrototypeOf(function (r, e) {
        try {
          api.get(r, e);
        } catch (r) {
          return !1;
        }
        return !0;
      }, __mockedFunctionPrototype), api.escape = Object.setPrototypeOf(function (r) {
        return r.toString().replace(/~/g, "~0").replace(/\//g, "~1");
      }, __mockedFunctionPrototype), api.unescape = Object.setPrototypeOf(function (r) {
        return r.replace(/~1/g, "/").replace(/~0/g, "~");
      }, __mockedFunctionPrototype), api.parse = Object.setPrototypeOf(function (r) {
        if (__mockedCompare("", r, "===")) return Object.setPrototypeOf([], __mockedArrayPrototype);
        if (__mockedCompare("/", r.charAt(0), "!==")) throw new Error("Invalid JSON pointer: " + r);
        return r.substring(1).split(/\//).map(api.unescape);
      }, __mockedFunctionPrototype), api.compile = Object.setPrototypeOf(function (r) {
        return __mockedCompare(0, r.length, "===") ? "" : "/" + r.map(api.escape).join("/");
      }, __mockedFunctionPrototype);
    }, __mockedFunctionPrototype), Object.setPrototypeOf({
      "foreach": 2
    }, __mockedObjectPrototype)], __mockedArrayPrototype),
    2: Object.setPrototypeOf([Object.setPrototypeOf(function (require, module, exports) {
      var hasOwn = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      module.exports = Object.setPrototypeOf(function forEach(obj, fn, ctx) {
        if (__mockedCompare(toString.call(fn), '[object Function]', "!==")) {
          throw new TypeError('iterator must be a function');
        }
        var l = obj.length;
        if (__mockedCompare(l, +l, "===")) {
          for (var i = 0; i < l; i++) {
            fn.call(ctx, __mockedPropertyAccess(obj, i), i, obj);
          }
        } else {
          for (var k in obj) {
            if (hasOwn.call(obj, k)) {
              fn.call(ctx, __mockedPropertyAccess(obj, k), k, obj);
            }
          }
        }
      }, __mockedFunctionPrototype);
    }, __mockedFunctionPrototype), Object.setPrototypeOf({}, __mockedObjectPrototype)], __mockedArrayPrototype)
  }, __mockedObjectPrototype), Object.setPrototypeOf({}, __mockedObjectPrototype), Object.setPrototypeOf([1], __mockedArrayPrototype))(1);
}, __mockedFunctionPrototype));