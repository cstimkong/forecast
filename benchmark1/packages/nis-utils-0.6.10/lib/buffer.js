'use_strict'

var stream = require('stream'),
    util = require('util');

/*
 * Simple helper for turning buffer into readable stream
 * @example: new BufferStream(myBuffer).pipe(response) 
 */

module.exports = {
    toStream: function(source){
        return new BufferStream(source);
    },
    fromStream: streamToBuffer,
    BufferStream: BufferStream,
};

// I turn the given source Buffer into a Readable stream.
function BufferStream(source) {
    if(!Buffer.isBuffer(source)){
	throw new Error('Source must be a buffer.');
    }
    
    // Super constructor.
    stream.Readable.call(this);
    this._source = source;
    
    // I keep track of which portion of the source buffer is currently being pushed
    // onto the internal stream buffer during read actions.
    this._offset = 0;
    this._length = source.length;
    
    // When the stream has ended, try to clean up the memory references.
    this.on('end', this._destroy);
}

util.inherits(BufferStream, stream.Readable);


// I attempt to clean up variable references once the stream has been ended.
// --
// NOTE: I am not sure this is necessary. But, I'm trying to be more cognizant of memory
// usage since my Node.js apps will (eventually) never restart.
BufferStream.prototype._destroy = function() {
    this._source = null;
    this._offset = null;
    this._length = null;
};

BufferStream.prototype._read = function( size ) {
    // If we haven't reached the end of the source buffer, push the next chunk onto
    // the internal stream buffer
    if(this._offset < this._length){
	this.push(this._source.slice(this._offset, (this._offset + size)));
	this._offset += size;
    }

    // If we've consumed the entire source buffer, close the readable stream.
    if(this._offset >= this._length){
        this.push( null );
    }
};


function streamToBuffer(stream, cb){ // cb(err, buffer);
    var bufs = [];
    stream.on('data', function(d){
        bufs.push(d);
    })
    .on('end', function(){
        cb(null, Buffer.concat(bufs));
    })
    .on('error', function(err){
        cb(err);
    });
}