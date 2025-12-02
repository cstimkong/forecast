chai        = require "chai"
objectUtils = require "../lib/utils.js"

describe( "Object value retrieval", () ->
    describe( "#getValue()", () ->
        it( "Should get the value", () ->
            testObject =  {
                foo:
                    bar: true
            }

            chai.expect( objectUtils.getValue( "foo.bar", testObject ) ).to.eql( true )
        )
    )

    describe( "#getValue()", () ->
        it( "Should get the value", () ->
            testObjectWithDottedKey =  {
                "foo.cheese":
                    bar: true
            }

            chai.expect( objectUtils.getValue( "foo%2Echeese.bar", testObjectWithDottedKey ) ).to.eql( true )
        )
    )

    describe( "#createValue()", () ->
        it( "Should create the value", () ->
            testCreate = {}

            objectUtils.getAndCreate( "foo%2Echeese.bar", testCreate )

            chai.expect( testCreate[ "foo.cheese" ].bar ).to.eql( {} )
        )
    )


    describe( "#setValue()", () ->
        it( "Should set the value", () ->
            testSet =
                "foo.cheese":
                    bar: "yes"

            objectUtils.setValue( "foo%2Echeese.bar", testSet, 1 )

            chai.expect( testSet[ "foo.cheese" ].bar ).to.eql( 1 )
        )
    )

    describe( "#setAndCreateValue()", () ->
        it( "Should create and set the value", () ->
            testCreateSet = {}

            objectUtils.setValue( "foo%2Echeese.bar", testCreateSet, 1 )

            chai.expect( testCreateSet[ "foo.cheese" ].bar ).to.eql( 1 )
        )
    )
)