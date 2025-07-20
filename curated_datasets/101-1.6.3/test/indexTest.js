var chai = require('chai'),
    getSetter = require('../index'),
    should = chai.should();

describe('setter', function() {
    it('should be able to set nested property', function() {
        var data = {};

        data.set = getSetter.set;

        data.set('user.name.first', 'Jojo');

        data.user.name.first.should.equal('Jojo');
    });
});

describe('getter', function() {
    it('should be able te get existing nested property', function() {
        var data = {
            user : {
                name : {
                    first : 'Moloko'
                }
            }
        };

        data.get = getSetter.get;

        data.get('user.name.first').should.equal('Moloko');
    });

    it('should be able to get an array index', function() {
        var data = { alphabet : ['a', 'b', 'c']};
        data.get = getSetter.get;
        data.get('alphabet.1').should.equal('b');
    });

    it('should return undefined if not ther', function() {
        var data = {};
        data.get = getSetter.get;
        should.equal(data.get('a.b.c.d.e.f.g'), undefined);
    })
});