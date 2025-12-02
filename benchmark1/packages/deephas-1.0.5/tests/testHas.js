var dh = require("../deepHas"),
    should = require("should");

/*
 * Test has
 */
var test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    test7,
    test8,
    test9,
    test10,
    test11,
    test12,
    hasObj;

hasObj = {
    "top" : {
        "middle" : {
            "bottom" : {
            }
        }
    },
    "truthy" : true,
    "falsey" : false
};
//data
test1 = dh.has(hasObj, "top");
test2 = dh.has(hasObj, "top.middle");
test3 = dh.has(hasObj, "top.middle.bottom");
test4 = dh.has(hasObj, "bottom");
test5 = dh.has(hasObj, "bottom.middle");
test6 = dh.has(hasObj, "bottom.middle.top");
test7 = dh.has();
test8 = dh.has(hasObj);
test9 = dh.has("top");
test10 = dh.has({}, "top");
test11 = dh.has(hasObj, "truthy");
test12 = dh.has(hasObj, "falsey");
test13 = dh.has(hasObj, "middle");

//assertions
test1.should.be.exactly(true);
test2.should.be.exactly(true);
test3.should.be.exactly(true);
test4.should.be.exactly(false);
test5.should.be.exactly(false);
test6.should.be.exactly(false);
test7.should.be.exactly(false);
test8.should.be.exactly(false);
test9.should.be.exactly(false);
test10.should.be.exactly(false);
test11.should.be.exactly(true);
test12.should.be.exactly(true);
test13.should.be.exactly(false);