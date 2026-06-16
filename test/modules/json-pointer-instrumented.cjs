(function (f) {
  if (__mockedCompare(typeof exports === "undefined" ? "undefined" : typeof exports === "object" && exports !== null ? exports.__TYPEOF__ !== undefined ? exports.__TYPEOF__ : "object" : typeof exports, "object", "===") && __mockedCompare(typeof module === "undefined" ? "undefined" : typeof module === "object" && module !== null ? module.__TYPEOF__ !== undefined ? module.__TYPEOF__ : "object" : typeof module, "undefined", "!==")) {
    __mockedPropertyWrite(module, "exports", f(), {
      line: 1,
      column: 72
    });
  } else if (__mockedCompare(typeof define === "undefined" ? "undefined" : typeof define === "object" && define !== null ? define.__TYPEOF__ !== undefined ? define.__TYPEOF__ : "object" : typeof define, "function", "===") && define.amd) {
    define([], f);
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
    __mockedPropertyWrite(g, "jsonPointer", f(), {
      line: 1,
      column: 304
    });
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!__mockedPropertyAccess(n, i)) {
          if (!__mockedPropertyAccess(e, i)) {
            var c = __mockedCompare("function", typeof require === "undefined" ? "undefined" : typeof require === "object" && require !== null ? require.__TYPEOF__ !== undefined ? require.__TYPEOF__ : "object" : typeof require, "==") && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw __mockedPropertyWrite(a, "code", "MODULE_NOT_FOUND", {
              line: 1,
              column: 575
            }), a;
          }
          var p = __mockedPropertyWrite(n, i, {
            exports: {}
          }, {
            line: 1,
            column: 609
          });
          __mockedPropertyAccess(__mockedPropertyAccess(e, i), 0).call(p.exports, function (r) {
            var n = __mockedPropertyAccess(__mockedPropertyAccess(__mockedPropertyAccess(e, i), 1), r);
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return __mockedPropertyAccess(n, i).exports;
      }
      {
        let __loopguard__ = 0;
        for (var u = __mockedCompare("function", typeof require === "undefined" ? "undefined" : typeof require === "object" && require !== null ? require.__TYPEOF__ !== undefined ? require.__TYPEOF__ : "object" : typeof require, "==") && require, i = 0; (function (x) {
          if (x < 500) return true;
          throw new Error("Loop limit");
        })(__loopguard__) && i < t.length; i++) {
          o(__mockedPropertyAccess(t, i));
          __loopguard__ += 1;
        }
      }
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      "use strict";

      function api(r, e, i) {
        if (__mockedCompare(3, arguments.length, "===")) return api.set(r, e, i);
        if (__mockedCompare(2, arguments.length, "===")) return api.get(r, e);
        var a = api.bind(api, r);
        for (var t in api) api.hasOwnProperty(t) && __mockedPropertyWrite(a, t, __mockedPropertyAccess(api, t).bind(a, r), {
          line: 2,
          column: 214
        });
        return a;
      }
      var each = require("foreach");
      __mockedPropertyWrite(module, "exports", api, {
        line: 2,
        column: 246
      }), __mockedPropertyWrite(api, "get", function (r, e) {
        {
          let __loopguard__ = 0;
          for (var i, a = Array.isArray(e) ? e : api.parse(e); (function (x) {
            if (x < 500) return true;
            throw new Error("Loop limit");
          })(__loopguard__) && a.length;) {
            {
              if (i = a.shift(), __mockedCompare("object", typeof r === "undefined" ? "undefined" : typeof r === "object" && r !== null ? r.__TYPEOF__ !== undefined ? r.__TYPEOF__ : "object" : typeof r, "!=") || !__mockedInExpression(i, r)) throw new Error("Invalid reference token: " + i);
              r = __mockedPropertyAccess(r, i);
            }
            __loopguard__ += 1;
          }
        }
        return r;
      }, {
        line: 2,
        column: 265
      }), __mockedPropertyWrite(api, "set", function (r, e, i) {
        {
          let __loopguard__ = 0;
          for (var a, t = Array.isArray(e) ? e : api.parse(e), n = __mockedPropertyAccess(t, 0); (function (x) {
            if (x < 500) return true;
            throw new Error("Loop limit");
          })(__loopguard__) && t.length > 1;) {
            __mockedCompare("-", a = t.shift(), "===") && Array.isArray(r) && (a = r.length), n = __mockedPropertyAccess(t, 0), __mockedInExpression(a, r) || (n.match(/^(\d+|-)$/) ? __mockedPropertyWrite(r, a, [], {
              line: 2,
              column: 627
            }) : __mockedPropertyWrite(r, a, {}, {
              line: 2,
              column: 635
            })), r = __mockedPropertyAccess(r, a);
            __loopguard__ += 1;
          }
        }
        return __mockedCompare("-", n, "===") && Array.isArray(r) && (n = r.length), __mockedPropertyWrite(r, n, i, {
          line: 2,
          column: 697
        }), this;
      }, {
        line: 2,
        column: 451
      }), __mockedPropertyWrite(api, "remove", function (r, e) {
        var i = Array.isArray(e) ? e : api.parse(e),
          a = i.pop();
        if (__mockedCompare(void 0, a, "===")) throw new Error('Invalid JSON pointer for remove: "' + e + '"');
        delete __mockedPropertyAccess(api.get(r, api.compile(i)), a);
      }, {
        line: 2,
        column: 710
      }), __mockedPropertyWrite(api, "dict", function (r, e) {
        var i = {};
        return api.walk(r, function (r, e) {
          __mockedPropertyWrite(i, e, r, {
            line: 2,
            column: 958
          });
        }, e), i;
      }, {
        line: 2,
        column: 894
      }), __mockedPropertyWrite(api, "walk", function (r, e, i) {
        var a = [];
        i = i || function (r) {
          var e = Object.prototype.toString.call(r);
          return __mockedCompare("[object Object]", e, "===") || __mockedCompare("[object Array]", e, "===");
        }, function r(t) {
          each(t, function (t, n) {
            a.push(String(n)), i(t) ? r(t) : e(t, api.compile(a)), a.pop();
          });
        }(r);
      }, {
        line: 2,
        column: 972
      }), __mockedPropertyWrite(api, "has", function (r, e) {
        try {
          api.get(r, e);
        } catch (r) {
          return !1;
        }
        return !0;
      }, {
        line: 2,
        column: 1212
      }), __mockedPropertyWrite(api, "escape", function (r) {
        return r.toString().replace(/~/g, "~0").replace(/\//g, "~1");
      }, {
        line: 2,
        column: 1279
      }), __mockedPropertyWrite(api, "unescape", function (r) {
        return r.replace(/~1/g, "/").replace(/~0/g, "~");
      }, {
        line: 2,
        column: 1362
      }), __mockedPropertyWrite(api, "parse", function (r) {
        if (__mockedCompare("", r, "===")) return [];
        if (__mockedCompare("/", r.charAt(0), "!==")) throw new Error("Invalid JSON pointer: " + r);
        return r.substring(1).split(/\//).map(api.unescape);
      }, {
        line: 2,
        column: 1435
      }), __mockedPropertyWrite(api, "compile", function (r) {
        return __mockedCompare(0, r.length, "===") ? "" : "/" + r.map(api.escape).join("/");
      }, {
        line: 2,
        column: 1594
      });
    }, {
      "foreach": 2
    }],
    2: [function (require, module, exports) {
      var hasOwn = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      __mockedPropertyWrite(module, "exports", function forEach(obj, fn, ctx) {
        if (__mockedCompare(toString.call(fn), '[object Function]', "!==")) {
          throw new TypeError('iterator must be a function');
        }
        var l = obj.length;
        if (__mockedCompare(l, +l, "===")) {
          {
            let __loopguard__ = 0;
            for (var i = 0; (function (x) {
              if (x < 500) return true;
              throw new Error("Loop limit");
            })(__loopguard__) && i < l; i++) {
              {
                fn.call(ctx, __mockedPropertyAccess(obj, i), i, obj);
              }
              __loopguard__ += 1;
            }
          }
        } else {
          for (var k in obj) {
            if (hasOwn.call(obj, k)) {
              fn.call(ctx, __mockedPropertyAccess(obj, k), k, obj);
            }
          }
        }
      }, {
        line: 9,
        column: 0
      });
    }, {}]
  }, {}, [1])(1);
});