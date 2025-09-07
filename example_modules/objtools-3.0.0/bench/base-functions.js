// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

let { benchset, compare, bench } = require('spectrophotometer');
let objtools = require('../lib');
let _ = require('lodash');

benchset('#isPlainObject', function() {

	compare('truthy', function() {
		const obj1 = { foo: 'bar' };

		bench('objtools.isPlainObject', function() {
			objtools.isPlainObject(obj1);
		});

		bench('lodash.isPlainObject', function() {
			_.isPlainObject(obj1);
		});
	});

	compare('falsy - scalar', function() {
		const obj1 = 42;

		bench('objtools.isPlainObject', function() {
			objtools.isPlainObject(obj1);
		});

		bench('lodash.isPlainObject', function() {
			_.isPlainObject(obj1);
		});
	});

	compare('falsy - class', function() {
		function TestConstructor() {}
		const obj1 = new TestConstructor();

		bench('objtools.isPlainObject', function() {
			objtools.isPlainObject(obj1);
		});

		bench('lodash.isPlainObject', function() {
			_.isPlainObject(obj1);
		});
	});

});

benchset('#isEmpty', function() {

	const values = {
		emptyObject: {},
		fullObject: { foo: 'bar' },
		emptyArray: [],
		fullArray: [ 2 ],
		emptyString: '',
		fullString: 'foo'
	};

	_.forEach(values, function(value, key) {
		compare(key, function() {
			bench('objtools.isEmpty', function() {
				objtools.isEmpty(value);
			});

			bench('lodash.isEmpty', function() {
				_.isEmpty(value);
			});
		});
	});

});

benchset('#merge', function() {
	compare('small objects', function() {
		const obj1 = { foo: 1, bar: { zip: 3 } };
		const obj2 = { foo: 3, zip: 4, bar: { bam: 4 } };

		bench('objtools.merge', function() {
			objtools.merge({}, obj1, obj2);
		});

		bench('objtools.mergeHeavy', function() {
			objtools.mergeHeavy({}, obj1, obj2);
		});

		bench('lodash.merge', function() {
			_.merge({}, obj1, obj2);
		});
	});

	compare('medium objects', function() {
		const obj1 = { a: {
			b: [ 'c' ],
			d: 'e',
			f: { g: 'h' },
			i: 'jk',
			l: [ 'o', 'l' ]
		} };

		const obj2 = { a: {
			b: 'c',
			d: [ 'e' ],
			f: 'gh',
			i: { j: 'k' },
			l: { o: 'l' }
		} };

		bench('objtools.merge', function() {
			objtools.merge({}, obj1, obj2);
		});

		bench('objtools.mergeHeavy', function() {
			objtools.mergeHeavy({}, obj1, obj2);
		});

		bench('lodash.merge', function() {
			_.merge({}, obj1, obj2);
		});
	});
});

benchset('#deepEquals', function() {
	compare('small objects', function() {
		const obj1 = { foo: 1, bar: { zip: 3 } };
		const obj2 = { foo: 3, zip: 4, bar: { bam: 4 } };

		bench('objtools.deepEquals', function() {
			objtools.deepEquals(obj1, obj2);
		});

		bench('lodash.isEqual', function() {
			_.isEqual(obj1, obj2);
		});
	});

	compare('medium objects', function() {
		const obj1 = { a: {
			b: [ 'c' ],
			d: 'e',
			f: { g: 'h' },
			i: 'jk',
			l: [ 'o', 'l' ]
		} };

		const obj2 = { a: {
			b: 'c',
			d: [ 'e' ],
			f: 'gh',
			i: { j: 'k' },
			l: { o: 'l' }
		} };

		bench('objtools.deepEquals', function() {
			objtools.deepEquals(obj1, obj2);
		});

		bench('lodash.isEqual', function() {
			_.isEqual(obj1, obj2);
		});
	});
});

benchset('#deepCopy', function() {
	compare('small objects', function() {
		const obj1 = { foo: 1, bar: { zip: 3 } };

		bench('objtools.deepCopy', function() {
			objtools.deepCopy(obj1);
		});

		bench('lodash.cloneDeep', function() {
			_.cloneDeep(obj1);
		});
	});

	compare('medium objects', function() {
		const obj1 = { a: {
			b: [ 'c' ],
			d: 'e',
			f: { g: 'h' },
			i: 'jk',
			l: [ 'o', 'l' ]
		} };

		bench('objtools.deepCopy', function() {
			objtools.deepCopy(obj1);
		});

		bench('lodash.cloneDeep', function() {
			_.cloneDeep(obj1);
		});
	});
});

benchset('Path functions', function() {
	let obj = { foo: { bar: [ { baz: 5 } ] } };

	compare('get path', function() {
		bench('objtools.getPath', function() {
			objtools.getPath(obj, 'foo.bar.0.baz');
		});
		bench('lodash.get', function() {
			_.get(obj, 'foo.bar[0].baz');
		});
	});

	compare('set path', function() {
		bench('objtools.setPath', function() {
			objtools.setPath(obj, 'foo.bar.0.baz', 5);
		});
		bench('lodash.set', function() {
			_.set(obj, 'foo.bar[0].baz', 5);
		});
	});

	bench('#deletePath', function() {
		objtools.deletePath(obj, 'foo.bar.0');
	});
});

benchset('Scalar Functions', function() {
	const obj1 = { a: {
		b: [ 'c' ],
		d: 'e',
		f: { g: 'h' },
		i: 'jk',
		l: [ 'o', 'l' ]
	} };

	const obj2 = { a: {
		b: 'c',
		d: [ 'e' ],
		f: 'gh',
		i: { j: 'k' },
		l: { o: 'l' }
	} };

	bench('isScalar', function() {
		objtools.isScalar(obj1);
	});

	bench('scalarEquals', function() {
		objtools.scalarEquals(obj1, obj2);
	});
});

benchset('Dotted Functions', function() {
	const obj1 = { a: {
		b: [ 'c' ],
		d: 'e',
		f: { g: 'h' },
		i: 'jk',
		l: [ 'o', 'l' ]
	} };

	const obj2 = { a: {
		b: 'c',
		d: [ 'e' ],
		f: 'gh',
		i: { j: 'k' },
		l: { o: 'l' }
	} };

	bench('collapseToDotted', function() {
		objtools.collapseToDotted(obj1);
	});

	bench('matchDottedObject', function() {
		objtools.matchDottedObject(obj1, obj2);
	});
});

benchset('Diff Functions', function() {
	const obj1 = { a: {
		b: [ 'c' ],
		d: 'e',
		f: { g: 'h' },
		i: 'jk',
		l: [ 'o', 'l' ]
	} };

	const obj2 = { a: {
		b: 'c',
		d: [ 'e' ],
		f: 'gh',
		i: { j: 'k' },
		l: { o: 'l' }
	} };

	bench('diffObjects', function() {
		objtools.diffObjects(obj1, obj2);
	});

	bench('dottedDiff', function() {
		objtools.dottedDiff(obj1. obj2);
	});
});

benchset('Misc Functions', function() {
	const obj1 = { a: {
		b: [ 'c' ],
		d: 'e',
		f: { g: 'h' },
		i: 'jk',
		l: [ 'o', 'l' ]
	} };
	const syncObj = {};

	bench('syncObject', function() {
		objtools.syncObject(syncObj, obj1);
	});

	bench('getDuplicates', function() {
		objtools.getDuplicates([ 'r', 'x', 'k', 'm', 'r', 'x', 'k' ]);
	});
});
