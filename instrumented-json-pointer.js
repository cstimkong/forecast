(function (module, exports, require, __filename, __dirname, __record__) {
  'use strict';

  /**
   * Convenience wrapper around the api.
   * Calls `.get` when called with an `object` and a `pointer`.
   * Calls `.set` when also called with `value`.
   * If only supplied `object`, returns a partially applied function, mapped to the object.
   *
   * @param {Object} obj
   * @param {String|Array} pointer
   * @param value
   * @returns {*}
   */

  function api(obj, pointer, value) {
    // .set()
    if (arguments.length === 3) {
      return (function (e) {
        const f = e.set;
        __record__({
          line: 22,
          column: 15,
          index: 508
        }, {
          line: 22,
          column: 22,
          index: 515
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(api, obj, pointer, value);
    }
    // .get()
    if (arguments.length === 2) {
      return (function (e) {
        const f = e.get;
        __record__({
          line: 26,
          column: 15,
          index: 607
        }, {
          line: 26,
          column: 22,
          index: 614
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(api, obj, pointer);
    }
    // Return a partially applied function on `obj`.
    var wrapped = (function (e) {
      const f = e.bind;
      __record__({
        line: 29,
        column: 18,
        index: 707
      }, {
        line: 29,
        column: 26,
        index: 715
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(api, api, obj);

    // Support for oo style
    for (var name in api) {
      if ((function (e) {
        const f = e.hasOwnProperty;
        __record__({
          line: 33,
          column: 12,
          index: 796
        }, {
          line: 33,
          column: 30,
          index: 814
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(api, name)) {
        (function (e) {
          __record__({
            line: 34,
            column: 12,
            index: 836
          }, {
            line: 34,
            column: 19,
            index: 843
          }, "./node_modules/json-pointer/index.js", {
            type: "objectCreation",
            value: __getcreationlocation__(f)
          });
          return e;
        })(wrapped)[name] = (function (x) {
          if (typeof x === "object" && x !== null && x.__tainted__) __record__({
            line: 34,
            column: 28,
            index: 852
          }, {
            line: 34,
            column: 56,
            index: 880
          }, "./node_modules/json-pointer/index.js", {
            type: "taintInfo",
            value: "TAINTED_WRITTEN_VALUE"
          });
          return x;
        })((function (e) {
          const f = e.bind;
          __record__({
            line: 34,
            column: 28,
            index: 852
          }, {
            line: 34,
            column: 42,
            index: 866
          }, "./node_modules/json-pointer/index.js", {
            type: "funcDef",
            value: __getdeflocation__(f)
          });
          return f.apply(e, Array.prototype.slice.call(arguments, 1));
        })(api[(function (x) {
          if (typeof x === "object" && x !== null && x.__tainted__) __record__({
            line: 34,
            column: 32,
            index: 856
          }, {
            line: 34,
            column: 36,
            index: 860
          }, "./node_modules/json-pointer/index.js", {
            type: "taintInfo",
            value: "TAINTED_ACCESS_PROP"
          });
          return x;
        })(name)], wrapped, obj));
      }
    }
    return wrapped;
  }

  /**
   * Lookup a json pointer in an object
   *
   * @param {Object} obj
   * @param {String|Array} pointer
   * @returns {*}
   */
  Object.defineProperty(api, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 19,
        column: 0,
        index: 408
      },
      end: {
        line: 38,
        column: 1,
        index: 919
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  });
  var each = (function (x) {
    __record__({
      line: 3,
      column: 11,
      index: 26
    }, {
      line: 3,
      column: 18,
      index: 33
    }, "./node_modules/json-pointer/index.js", {
      type: "funcDef",
      value: __getdeflocation__(x)
    });
    return x;
  })(require)('foreach');
  (function (e) {
    __record__({
      line: 4,
      column: 0,
      index: 46
    }, {
      line: 4,
      column: 6,
      index: 52
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(module).exports = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 4,
      column: 17,
      index: 63
    }, {
      line: 4,
      column: 20,
      index: 66
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(api);
  (function (e) {
    __record__({
      line: 48,
      column: 0,
      index: 1043
    }, {
      line: 48,
      column: 3,
      index: 1046
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).get = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 48,
      column: 10,
      index: 1053
    }, {
      line: 59,
      column: 1,
      index: 1416
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function get(obj, pointer) {
    var refTokens = Array.isArray(pointer) ? pointer : (function (e) {
      const f = e.parse;
      __record__({
        line: 49,
        column: 55,
        index: 1138
      }, {
        line: 49,
        column: 64,
        index: 1147
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(api, pointer);
    for (var i = 0; i < refTokens.length; ++i) {
      var tok = refTokens[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 52,
          column: 28,
          index: 1236
        }, {
          line: 52,
          column: 29,
          index: 1237
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })(i)];
      if (!((typeof obj !== "object" ? typeof obj : obj.__tainted__ ? obj.__typeof__ : "object") == 'object' && tok in obj)) {
        throw Object.defineProperty(new Error((function (a, b) {
          return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
        })('Invalid reference token: ', tok)), "__creationlocation__", {
          enumerable: false,
          configurable: false,
          value: {
            start: {
              line: 54,
              column: 18,
              index: 1313
            },
            end: {
              line: 54,
              column: 62,
              index: 1357
            },
            filename: "./node_modules/json-pointer/index.js"
          }
        });
      }
      obj = (function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 56,
          column: 14,
          index: 1383
        }, {
          line: 56,
          column: 22,
          index: 1391
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_WRITTEN_VALUE"
        });
        return x;
      })(obj[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 56,
          column: 18,
          index: 1387
        }, {
          line: 56,
          column: 21,
          index: 1390
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })(tok)]);
    }
    return obj;
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 48,
        column: 10,
        index: 1053
      },
      end: {
        line: 59,
        column: 1,
        index: 1416
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Sets a value on an object
   *
   * @param {Object} obj
   * @param {String|Array} pointer
   * @param value
   */
  (function (e) {
    __record__({
      line: 68,
      column: 0,
      index: 1531
    }, {
      line: 68,
      column: 3,
      index: 1534
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).set = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 68,
      column: 10,
      index: 1541
    }, {
      line: 103,
      column: 1,
      index: 2541
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function set(obj, pointer, value) {
    var refTokens = Array.isArray(pointer) ? pointer : (function (e) {
        const f = e.parse;
        __record__({
          line: 69,
          column: 55,
          index: 1633
        }, {
          line: 69,
          column: 64,
          index: 1642
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(api, pointer),
      nextTok = refTokens[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 70,
          column: 26,
          index: 1679
        }, {
          line: 70,
          column: 27,
          index: 1680
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })(0)];
    if (refTokens.length === 0) {
      throw (function (x) {
        __record__({
          line: 73,
          column: 12,
          index: 1730
        }, {
          line: 73,
          column: 17,
          index: 1735
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(x)
        });
        return x;
      })(Error)('Can not set the root object');
    }
    for (var i = 0; i < refTokens.length - 1; ++i) {
      var tok = refTokens[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 77,
          column: 28,
          index: 1856
        }, {
          line: 77,
          column: 29,
          index: 1857
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })(i)];
      if ((typeof tok !== "object" ? typeof tok : tok.__tainted__ ? tok.__typeof__ : "object") !== 'string' && (typeof tok !== "object" ? typeof tok : tok.__tainted__ ? tok.__typeof__ : "object") !== 'number') {
        tok = (function (x) {
          if (typeof x === "object" && x !== null && x.__tainted__) __record__({
            line: 79,
            column: 16,
            index: 1942
          }, {
            line: 79,
            column: 27,
            index: 1953
          }, "./node_modules/json-pointer/index.js", {
            type: "taintInfo",
            value: "TAINTED_WRITTEN_VALUE"
          });
          return x;
        })(String(tok));
      }
      if (tok === "__proto__" || tok === "constructor" || tok === "prototype") {
        continue;
      }
      if (tok === '-' && Array.isArray(obj)) {
        tok = (function (x) {
          if (typeof x === "object" && x !== null && x.__tainted__) __record__({
            line: 85,
            column: 16,
            index: 2143
          }, {
            line: 85,
            column: 26,
            index: 2153
          }, "./node_modules/json-pointer/index.js", {
            type: "taintInfo",
            value: "TAINTED_WRITTEN_VALUE"
          });
          return x;
        })(obj.length);
      }
      nextTok = (function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 87,
          column: 18,
          index: 2183
        }, {
          line: 87,
          column: 34,
          index: 2199
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_WRITTEN_VALUE"
        });
        return x;
      })(refTokens[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 87,
          column: 28,
          index: 2193
        }, {
          line: 87,
          column: 33,
          index: 2198
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })((function (a, b) {
        return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
      })(i, 1))]);
      if (!(tok in obj)) {
        if ((function (e) {
          const f = e.match;
          __record__({
            line: 90,
            column: 16,
            index: 2247
          }, {
            line: 90,
            column: 29,
            index: 2260
          }, "./node_modules/json-pointer/index.js", {
            type: "funcDef",
            value: __getdeflocation__(f)
          });
          return f.apply(e, Array.prototype.slice.call(arguments, 1));
        })(nextTok, /^(\d+|-)$/)) {
          (function (e) {
            __record__({
              line: 91,
              column: 16,
              index: 2293
            }, {
              line: 91,
              column: 19,
              index: 2296
            }, "./node_modules/json-pointer/index.js", {
              type: "objectCreation",
              value: __getcreationlocation__(f)
            });
            return e;
          })(obj)[tok] = (function (x) {
            if (typeof x === "object" && x !== null && x.__tainted__) __record__({
              line: 91,
              column: 27,
              index: 2304
            }, {
              line: 91,
              column: 29,
              index: 2306
            }, "./node_modules/json-pointer/index.js", {
              type: "taintInfo",
              value: "TAINTED_WRITTEN_VALUE"
            });
            return x;
          })([]);
        } else {
          (function (e) {
            __record__({
              line: 93,
              column: 16,
              index: 2345
            }, {
              line: 93,
              column: 19,
              index: 2348
            }, "./node_modules/json-pointer/index.js", {
              type: "objectCreation",
              value: __getcreationlocation__(f)
            });
            return e;
          })(obj)[tok] = (function (x) {
            if (typeof x === "object" && x !== null && x.__tainted__) __record__({
              line: 93,
              column: 27,
              index: 2356
            }, {
              line: 93,
              column: 29,
              index: 2358
            }, "./node_modules/json-pointer/index.js", {
              type: "taintInfo",
              value: "TAINTED_WRITTEN_VALUE"
            });
            return x;
          })(Object.defineProperty({}, "__creationlocation__", {
            enumerable: false,
            configurable: false,
            value: {
              start: {
                line: 93,
                column: 27,
                index: 2356
              },
              end: {
                line: 93,
                column: 29,
                index: 2358
              },
              filename: "./node_modules/json-pointer/index.js"
            }
          }));
        }
      }
      obj = (function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 96,
          column: 14,
          index: 2398
        }, {
          line: 96,
          column: 22,
          index: 2406
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_WRITTEN_VALUE"
        });
        return x;
      })(obj[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 96,
          column: 18,
          index: 2402
        }, {
          line: 96,
          column: 21,
          index: 2405
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })(tok)]);
    }
    if (nextTok === '-' && Array.isArray(obj)) {
      nextTok = (function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 99,
          column: 16,
          index: 2479
        }, {
          line: 99,
          column: 26,
          index: 2489
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_WRITTEN_VALUE"
        });
        return x;
      })(obj.length);
    }
    (function (e) {
      __record__({
        line: 101,
        column: 4,
        index: 2501
      }, {
        line: 101,
        column: 7,
        index: 2504
      }, "./node_modules/json-pointer/index.js", {
        type: "objectCreation",
        value: __getcreationlocation__(f)
      });
      return e;
    })(obj)[nextTok] = (function (x) {
      if (typeof x === "object" && x !== null && x.__tainted__) __record__({
        line: 101,
        column: 19,
        index: 2516
      }, {
        line: 101,
        column: 24,
        index: 2521
      }, "./node_modules/json-pointer/index.js", {
        type: "taintInfo",
        value: "TAINTED_WRITTEN_VALUE"
      });
      return x;
    })(value);
    return this;
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 68,
        column: 10,
        index: 1541
      },
      end: {
        line: 103,
        column: 1,
        index: 2541
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Removes an attribute
   *
   * @param {Object} obj
   * @param {String|Array} pointer
   */
  (function (e) {
    __record__({
      line: 111,
      column: 0,
      index: 2635
    }, {
      line: 111,
      column: 3,
      index: 2638
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).remove = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 111,
      column: 13,
      index: 2648
    }, {
      line: 129,
      column: 1,
      index: 3275
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function (obj, pointer) {
    var refTokens = Array.isArray(pointer) ? pointer : (function (e) {
      const f = e.parse;
      __record__({
        line: 112,
        column: 55,
        index: 2729
      }, {
        line: 112,
        column: 64,
        index: 2738
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(api, pointer);
    var finalToken = refTokens[(function (x) {
      if (typeof x === "object" && x !== null && x.__tainted__) __record__({
        line: 113,
        column: 31,
        index: 2780
      }, {
        line: 113,
        column: 50,
        index: 2799
      }, "./node_modules/json-pointer/index.js", {
        type: "taintInfo",
        value: "TAINTED_ACCESS_PROP"
      });
      return x;
    })(refTokens.length - 1)];
    if (finalToken === undefined) {
      throw Object.defineProperty(new Error((function (a, b) {
        return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
      })((function (a, b) {
        return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
      })('Invalid JSON pointer for remove: "', pointer), '"')), "__creationlocation__", {
        enumerable: false,
        configurable: false,
        value: {
          start: {
            line: 115,
            column: 14,
            index: 2852
          },
          end: {
            line: 115,
            column: 77,
            index: 2915
          },
          filename: "./node_modules/json-pointer/index.js"
        }
      });
    }
    var parent = (function (e) {
      const f = e.get;
      __record__({
        line: 118,
        column: 17,
        index: 2941
      }, {
        line: 118,
        column: 24,
        index: 2948
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(api, obj, (function (e) {
      const f = e.slice;
      __record__({
        line: 118,
        column: 30,
        index: 2954
      }, {
        line: 118,
        column: 45,
        index: 2969
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(refTokens, 0, -1));
    if (Array.isArray(parent)) {
      var index = +finalToken;
      if (finalToken === '' && (function (x) {
        __record__({
          line: 121,
          column: 31,
          index: 3074
        }, {
          line: 121,
          column: 36,
          index: 3079
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(x)
        });
        return x;
      })(isNaN)(index)) {
        throw Object.defineProperty(new Error((function (a, b) {
          return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
        })((function (a, b) {
          return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
        })('Invalid array index: "', finalToken), '"')), "__creationlocation__", {
          enumerable: false,
          configurable: false,
          value: {
            start: {
              line: 122,
              column: 14,
              index: 3104
            },
            end: {
              line: 122,
              column: 68,
              index: 3158
            },
            filename: "./node_modules/json-pointer/index.js"
          }
        });
      }
      (function (e) {
        const f = e.call;
        __record__({
          line: 125,
          column: 6,
          index: 3175
        }, {
          line: 125,
          column: 33,
          index: 3202
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(Array.prototype.splice, parent, index, 1);
    } else {
      delete parent[(function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 127,
          column: 20,
          index: 3255
        }, {
          line: 127,
          column: 30,
          index: 3265
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_ACCESS_PROP"
        });
        return x;
      })(finalToken)];
    }
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 111,
        column: 13,
        index: 2648
      },
      end: {
        line: 129,
        column: 1,
        index: 3275
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Returns a (pointer -> value) dictionary for an object
   *
   * @param obj
   * @param {function} descend
   * @returns {}
   */
  (function (e) {
    __record__({
      line: 138,
      column: 0,
      index: 3404
    }, {
      line: 138,
      column: 3,
      index: 3407
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).dict = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 138,
      column: 11,
      index: 3415
    }, {
      line: 144,
      column: 1,
      index: 3586
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function dict(obj, descend) {
    var results = Object.defineProperty({}, "__creationlocation__", {
      enumerable: false,
      configurable: false,
      value: {
        start: {
          line: 139,
          column: 18,
          index: 3464
        },
        end: {
          line: 139,
          column: 20,
          index: 3466
        },
        filename: "./node_modules/json-pointer/index.js"
      }
    });
    (function (e) {
      const f = e.walk;
      __record__({
        line: 140,
        column: 4,
        index: 3472
      }, {
        line: 140,
        column: 12,
        index: 3480
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(api, obj, Object.defineProperty(function (value, pointer) {
      (function (e) {
        __record__({
          line: 141,
          column: 8,
          index: 3522
        }, {
          line: 141,
          column: 15,
          index: 3529
        }, "./node_modules/json-pointer/index.js", {
          type: "objectCreation",
          value: __getcreationlocation__(f)
        });
        return e;
      })(results)[pointer] = (function (x) {
        if (typeof x === "object" && x !== null && x.__tainted__) __record__({
          line: 141,
          column: 27,
          index: 3541
        }, {
          line: 141,
          column: 32,
          index: 3546
        }, "./node_modules/json-pointer/index.js", {
          type: "taintInfo",
          value: "TAINTED_WRITTEN_VALUE"
        });
        return x;
      })(value);
    }, "__deflocation__", {
      enumerable: false,
      configurable: false,
      value: {
        start: {
          line: 140,
          column: 18,
          index: 3486
        },
        end: {
          line: 142,
          column: 5,
          index: 3553
        },
        filename: "./node_modules/json-pointer/index.js"
      }
    }), descend);
    return results;
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 138,
        column: 11,
        index: 3415
      },
      end: {
        line: 144,
        column: 1,
        index: 3586
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Iterates over an object
   * Iterator: function (value, pointer) {}
   *
   * @param obj
   * @param {function} iterator
   * @param {function} descend
   */
  (function (e) {
    __record__({
      line: 154,
      column: 0,
      index: 3742
    }, {
      line: 154,
      column: 3,
      index: 3745
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).walk = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 154,
      column: 11,
      index: 3753
    }, {
      line: 173,
      column: 1,
      index: 4321
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function walk(obj, iterator, descend) {
    var refTokens = [];
    descend = (function (x) {
      if (typeof x === "object" && x !== null && x.__tainted__) __record__({
        line: 157,
        column: 14,
        index: 3833
      }, {
        line: 160,
        column: 5,
        index: 3998
      }, "./node_modules/json-pointer/index.js", {
        type: "taintInfo",
        value: "TAINTED_WRITTEN_VALUE"
      });
      return x;
    })(descend || Object.defineProperty(function (value) {
      var type = (function (e) {
        const f = e.call;
        __record__({
          line: 158,
          column: 19,
          index: 3882
        }, {
          line: 158,
          column: 49,
          index: 3912
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(Object.prototype.toString, value);
      return type === '[object Object]' || type === '[object Array]';
    }, "__deflocation__", {
      enumerable: false,
      configurable: false,
      value: {
        start: {
          line: 157,
          column: 25,
          index: 3844
        },
        end: {
          line: 160,
          column: 5,
          index: 3998
        },
        filename: "./node_modules/json-pointer/index.js"
      }
    }));
    (function (x) {
      __record__({
        line: 162,
        column: 5,
        index: 4006
      }, {
        line: 172,
        column: 5,
        index: 4312
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(x)
      });
      return x;
    })(Object.defineProperty(function next(cur) {
      (function (x) {
        __record__({
          line: 163,
          column: 8,
          index: 4036
        }, {
          line: 163,
          column: 12,
          index: 4040
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(x)
        });
        return x;
      })(each)(cur, Object.defineProperty(function (value, key) {
        (function (e) {
          const f = e.push;
          __record__({
            line: 164,
            column: 12,
            index: 4082
          }, {
            line: 164,
            column: 26,
            index: 4096
          }, "./node_modules/json-pointer/index.js", {
            type: "funcDef",
            value: __getdeflocation__(f)
          });
          return f.apply(e, Array.prototype.slice.call(arguments, 1));
        })(refTokens, String(key));
        if ((function (x) {
          __record__({
            line: 165,
            column: 16,
            index: 4127
          }, {
            line: 165,
            column: 23,
            index: 4134
          }, "./node_modules/json-pointer/index.js", {
            type: "funcDef",
            value: __getdeflocation__(x)
          });
          return x;
        })(descend)(value)) {
          (function (x) {
            __record__({
              line: 166,
              column: 16,
              index: 4161
            }, {
              line: 166,
              column: 20,
              index: 4165
            }, "./node_modules/json-pointer/index.js", {
              type: "funcDef",
              value: __getdeflocation__(x)
            });
            return x;
          })(next)(value);
        } else {
          (function (x) {
            __record__({
              line: 168,
              column: 16,
              index: 4211
            }, {
              line: 168,
              column: 24,
              index: 4219
            }, "./node_modules/json-pointer/index.js", {
              type: "funcDef",
              value: __getdeflocation__(x)
            });
            return x;
          })(iterator)(value, (function (e) {
            const f = e.compile;
            __record__({
              line: 168,
              column: 32,
              index: 4227
            }, {
              line: 168,
              column: 43,
              index: 4238
            }, "./node_modules/json-pointer/index.js", {
              type: "funcDef",
              value: __getdeflocation__(f)
            });
            return f.apply(e, Array.prototype.slice.call(arguments, 1));
          })(api, refTokens));
        }
        (function (e) {
          const f = e.pop;
          __record__({
            line: 170,
            column: 12,
            index: 4278
          }, {
            line: 170,
            column: 25,
            index: 4291
          }, "./node_modules/json-pointer/index.js", {
            type: "funcDef",
            value: __getdeflocation__(f)
          });
          return f.apply(e, Array.prototype.slice.call(arguments, 1));
        })(refTokens);
      }, "__deflocation__", {
        enumerable: false,
        configurable: false,
        value: {
          start: {
            line: 163,
            column: 18,
            index: 4046
          },
          end: {
            line: 171,
            column: 9,
            index: 4304
          },
          filename: "./node_modules/json-pointer/index.js"
        }
      }));
    }, "__deflocation__", {
      enumerable: false,
      configurable: false,
      value: {
        start: {
          line: 162,
          column: 5,
          index: 4006
        },
        end: {
          line: 172,
          column: 5,
          index: 4312
        },
        filename: "./node_modules/json-pointer/index.js"
      }
    }))(obj);
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 154,
        column: 11,
        index: 3753
      },
      end: {
        line: 173,
        column: 1,
        index: 4321
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Tests if an object has a value for a json pointer
   *
   * @param obj
   * @param pointer
   * @returns {boolean}
   */
  (function (e) {
    __record__({
      line: 182,
      column: 0,
      index: 4442
    }, {
      line: 182,
      column: 3,
      index: 4445
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).has = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 182,
      column: 10,
      index: 4452
    }, {
      line: 189,
      column: 1,
      index: 4587
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function has(obj, pointer) {
    try {
      (function (e) {
        const f = e.get;
        __record__({
          line: 184,
          column: 8,
          index: 4500
        }, {
          line: 184,
          column: 15,
          index: 4507
        }, "./node_modules/json-pointer/index.js", {
          type: "funcDef",
          value: __getdeflocation__(f)
        });
        return f.apply(e, Array.prototype.slice.call(arguments, 1));
      })(api, obj, pointer);
    } catch (e) {
      return false;
    }
    return true;
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 182,
        column: 10,
        index: 4452
      },
      end: {
        line: 189,
        column: 1,
        index: 4587
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Escapes a reference token
   *
   * @param str
   * @returns {string}
   */
  (function (e) {
    __record__({
      line: 197,
      column: 0,
      index: 4665
    }, {
      line: 197,
      column: 3,
      index: 4668
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).escape = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 197,
      column: 13,
      index: 4678
    }, {
      line: 199,
      column: 1,
      index: 4771
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function escape(str) {
    return (function (e) {
      const f = e.replace;
      __record__({
        line: 198,
        column: 11,
        index: 4713
      }, {
        line: 198,
        column: 53,
        index: 4755
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })((function (e) {
      const f = e.replace;
      __record__({
        line: 198,
        column: 11,
        index: 4713
      }, {
        line: 198,
        column: 33,
        index: 4735
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })((function (e) {
      const f = e.toString;
      __record__({
        line: 198,
        column: 11,
        index: 4713
      }, {
        line: 198,
        column: 23,
        index: 4725
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(str), /~/g, '~0'), /\//g, '~1');
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 197,
        column: 13,
        index: 4678
      },
      end: {
        line: 199,
        column: 1,
        index: 4771
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Unescapes a reference token
   *
   * @param str
   * @returns {string}
   */
  (function (e) {
    __record__({
      line: 207,
      column: 0,
      index: 4851
    }, {
      line: 207,
      column: 3,
      index: 4854
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).unescape = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 207,
      column: 15,
      index: 4866
    }, {
      line: 209,
      column: 1,
      index: 4949
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function unescape(str) {
    return (function (e) {
      const f = e.replace;
      __record__({
        line: 208,
        column: 11,
        index: 4903
      }, {
        line: 208,
        column: 42,
        index: 4934
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })((function (e) {
      const f = e.replace;
      __record__({
        line: 208,
        column: 11,
        index: 4903
      }, {
        line: 208,
        column: 22,
        index: 4914
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(str, /~1/g, '/'), /~0/g, '~');
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 207,
        column: 15,
        index: 4866
      },
      end: {
        line: 209,
        column: 1,
        index: 4949
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Converts a json pointer into a array of reference tokens
   *
   * @param pointer
   * @returns {Array}
   */
  (function (e) {
    __record__({
      line: 217,
      column: 0,
      index: 5061
    }, {
      line: 217,
      column: 3,
      index: 5064
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).parse = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 217,
      column: 12,
      index: 5073
    }, {
      line: 221,
      column: 1,
      index: 5295
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function parse(pointer) {
    if (pointer === '') {
      return [];
    }
    if ((function (e) {
      const f = e.charAt;
      __record__({
        line: 219,
        column: 8,
        index: 5147
      }, {
        line: 219,
        column: 22,
        index: 5161
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(pointer, 0) !== '/') {
      throw Object.defineProperty(new Error((function (a, b) {
        return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
      })('Invalid JSON pointer: ', pointer)), "__creationlocation__", {
        enumerable: false,
        configurable: false,
        value: {
          start: {
            line: 219,
            column: 43,
            index: 5182
          },
          end: {
            line: 219,
            column: 88,
            index: 5227
          },
          filename: "./node_modules/json-pointer/index.js"
        }
      });
    }
    return (function (e) {
      const f = e.map;
      __record__({
        line: 220,
        column: 11,
        index: 5242
      }, {
        line: 220,
        column: 47,
        index: 5278
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })((function (e) {
      const f = e.split;
      __record__({
        line: 220,
        column: 11,
        index: 5242
      }, {
        line: 220,
        column: 37,
        index: 5268
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })((function (e) {
      const f = e.substring;
      __record__({
        line: 220,
        column: 11,
        index: 5242
      }, {
        line: 220,
        column: 28,
        index: 5259
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(pointer, 1), /\//), api.unescape);
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 217,
        column: 12,
        index: 5073
      },
      end: {
        line: 221,
        column: 1,
        index: 5295
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));

  /**
   * Builds a json pointer from a array of reference tokens
   *
   * @param refTokens
   * @returns {string}
   */
  (function (e) {
    __record__({
      line: 229,
      column: 0,
      index: 5408
    }, {
      line: 229,
      column: 3,
      index: 5411
    }, "./node_modules/json-pointer/index.js", {
      type: "objectCreation",
      value: __getcreationlocation__(f)
    });
    return e;
  })(api).compile = (function (x) {
    if (typeof x === "object" && x !== null && x.__tainted__) __record__({
      line: 229,
      column: 14,
      index: 5422
    }, {
      line: 232,
      column: 1,
      index: 5555
    }, "./node_modules/json-pointer/index.js", {
      type: "taintInfo",
      value: "TAINTED_WRITTEN_VALUE"
    });
    return x;
  })(Object.defineProperty(function compile(refTokens) {
    if (refTokens.length === 0) {
      return '';
    }
    return (function (a, b) {
      return typeof a === 'object' && a.__tainted__ || typeof b === 'object' && b.__tainted__ ? __makeProxyString__(a + b) : a + b;
    })('/', (function (e) {
      const f = e.join;
      __record__({
        line: 231,
        column: 17,
        index: 5517
      }, {
        line: 231,
        column: 47,
        index: 5547
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })((function (e) {
      const f = e.map;
      __record__({
        line: 231,
        column: 17,
        index: 5517
      }, {
        line: 231,
        column: 30,
        index: 5530
      }, "./node_modules/json-pointer/index.js", {
        type: "funcDef",
        value: __getdeflocation__(f)
      });
      return f.apply(e, Array.prototype.slice.call(arguments, 1));
    })(refTokens, api.escape), '/'));
  }, "__deflocation__", {
    enumerable: false,
    configurable: false,
    value: {
      start: {
        line: 229,
        column: 14,
        index: 5422
      },
      end: {
        line: 232,
        column: 1,
        index: 5555
      },
      filename: "./node_modules/json-pointer/index.js"
    }
  }));
})