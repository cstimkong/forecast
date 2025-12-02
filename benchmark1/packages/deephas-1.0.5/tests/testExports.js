var dh = require("../deepHas"),
    should = require("should");

/*
 * Test of exports
 * public functions should be visible (hasProperty and getProperty)
 * private function should be hidden(deepProperty)
 */
dh.should.be.an.instanceOf(Object).and.have.property('has');
dh.should.have.property('get');
dh.should.have.property('set');
dh.should.be.an.instanceOf(Object).and.not.have.property('deep');
dh.has.should.be.an.instanceOf(Function);
dh.get.should.be.an.instanceOf(Function);
dh.set.should.be.an.instanceOf(Function);