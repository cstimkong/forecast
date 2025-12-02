var dh = require("../deepHas"),
    should = require("should");

/*
 * Test get
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
    getObj;

getObj = {
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
test1 = dh.get(getObj, "top");
test2 = dh.get(getObj, "top.middle");
test3 = dh.get(getObj, "top.middle.bottom");
test4 = dh.get(getObj, "bottom");
test5 = dh.get(getObj, "bottom.middle");
test6 = dh.get(getObj, "bottom.middle.top");
test7 = dh.get();
test8 = dh.get(getObj);
test9 = dh.get("top");
test10 = dh.get({}, "top");
test11 = dh.get(getObj, "truthy");
test12 = dh.get(getObj, "falsey");

//assertions
should(test1).have.property("middle", {
    "bottom" : {}
});
should(test2).have.property("bottom", {});
test3.should.be.an.instanceOf(Object);
should.not.exist(test4);
should.not.exist(test5);
should.not.exist(test6);
should.not.exist(test7);
should.not.exist(test8);
should.not.exist(test9);
should.not.exist(test10);
test11.should.be.exactly(true);
test12.should.be.exactly(false);