var dh = require("../deepHas"),
    should = require("should"),
    obj,
    obj2,
    test2;

obj = {
    "top" : {
        "middle" : {
            "bottom" : {
                "val" : "1"
            }
        }
    },
    "truthy" : true,
    "falsey" : false
};

dh.set(obj, "top.middle.bottom", {
    "val" : "2"
});

//assertions
JSON.stringify(obj).should.equal(JSON.stringify({
    "top" : {
        "middle" : {
            "bottom" : {
                "val" : "2"
            }
        }
    },
    "truthy" : true,
    "falsey" : false
}));

dh.set(obj, "top.middle.left", {
    "val" : "1"
});

JSON.stringify(obj).should.equal(JSON.stringify({
    "top" : {
        "middle" : {
            "bottom" : {
                "val" : "2"
            },
            "left" : {
                "val" : "1"
            }
        }
    },
    "truthy" : true,
    "falsey" : false
}));

dh.set(obj, "top.middle.right", {
    "val" : "1"
});

JSON.stringify(obj).should.equal(JSON.stringify({
    "top" : {
        "middle" : {
            "bottom" : {
                "val" : "2"
            },
            "left" : {
                "val" : "1"
            },
            "right" : {
                "val" : "1"
            }
        }
    },
    "truthy" : true,
    "falsey" : false
}));

dh.set(obj, "top.bottom.right", {
    "val" : "1"
});

JSON.stringify(obj).should.equal(JSON.stringify({
    "top" : {
        "middle" : {
            "bottom" : {
                "val" : "2"
            },
            "left" : {
                "val" : "1"
            },
            "right" : {
                "val" : "1"
            }
        },
        "bottom" : {
            "right" : {
                "val" : "1"
            }
        }
    },
    "truthy" : true,
    "falsey" : false
}));

dh.set(obj, "bottom.middle.top", {
    "val" : "1"
});

JSON.stringify(obj).should.equal(JSON.stringify({
    "top" : {
        "middle" : {
            "bottom" : {
                "val" : "2"
            },
            "left" : {
                "val" : "1"
            },
            "right" : {
                "val" : "1"
            }
        },
        "bottom" : {
            "right" : {
                "val" : "1"
            }
        }
    },
    "truthy" : true,
    "falsey" : false,
    "bottom" : {
        "middle" : {
            "top" : {
                "val" : "1"
            }
        }
    }
}));
var test2 = {
    "bottom" : {
        "middle" : {
            "top" : ["paul", 1, {
                "test" : "test"
            }]
        }
    }
};

obj2 = {

};
dh.set(obj2, "bottom.middle.top", ["paul", 1, {
    "test" : "test"
}]);

JSON.stringify(obj2).should.equal(JSON.stringify(test2));
