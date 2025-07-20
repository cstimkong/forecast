import test from 'ava';
import sahmat from '.';

test('test', t => {
  const object = {
    a: {
      b: {
        e: {
          d: 1,
        },
      },
    },
  };

  t.is(object.a.b.e.d, 1);
  t.is(sahmat(object, 'a.b.e.d'), 1);

  sahmat(object, 'a', 'hi there');

  t.is(sahmat(object, 'a'), 'hi there');
  t.is(sahmat(object, 'a.b'), undefined);
  t.is(sahmat(object, 'a.b.c'), undefined);
  t.is(sahmat(object, 'a.b.c.d'), undefined);
  
  sahmat(object, 'a', [1,2,[3,4]]);
  t.is(sahmat(object, 'a.0'), 1);
  t.is(sahmat(object, 'a.1'), 2);
  t.is(sahmat(object, 'a.2.1'), 4);
});
