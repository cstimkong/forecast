chai        = require "chai"
objectUtils = require "../lib/utils.js"

describe( "Object manipulations", () ->
    describe( "#createValue()", () ->
        it( "Should create the value", () ->
            testCreate = {}

            objectUtils.getAndCreate( "foo.bar", testCreate )

            chai.expect( testCreate.foo.bar ).to.eql( {} )
        )
    )


    describe( "#setValue()", () ->
        it( "Should set the value", () ->
            testSet =
                foo:
                    bar: "yes"

            objectUtils.setValue( "foo.bar", testSet, 1 )

            chai.expect( testSet.foo.bar ).to.eql( 1 )
        )
    )

    describe( "#setAndCreateValue()", () ->
        it( "Should create and set the value", () ->
            testCreateSet = {}

            objectUtils.setValue( "foo.bar", testCreateSet, 1 )

            chai.expect( testCreateSet.foo.bar ).to.eql( 1 )
        )
    )
)