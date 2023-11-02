/* eslint-disable max-lines */
// 'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Pool: add/next', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  test.strictSame(await pool.next(), obj1);
  test.strictSame(await pool.next(), obj2);
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj1);
  test.end();
});

metatests.test('Pool: empty', async (test) => {
  const pool = new metautil.Pool();
  // test.strictSame(await pool.next(), null);
  try {
    await pool.next();
  } catch (err) {
    test.strictSame(err.message, 'Pool: next item timeout');
  }
  test.end();
});

metatests.test('Pool: capture/next', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  test.strictSame(pool.isFree(obj1), true);
  test.strictSame(pool.isFree(obj2), true);
  test.strictSame(pool.isFree(obj3), true);

  const { item, release } = await pool.capture();
  test.strictSame(item, obj1);
  test.strictSame(pool.isFree(item), false);
  test.strictSame(await pool.next(), obj2);
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj2);

  release();
  release();
  test.strictSame(pool.isFree(item), true);
  // try {
  //   pool.release(item);
  // } catch (err) {
  //   test.strictSame(err.message, 'Pool: release not captured');
  // }
  test.strictSame(await pool.next(), obj3);
  // test.strictSame(await pool.next(), obj1);
  test.strictSame(await pool.next(), obj2);
  test.end();
});

metatests.test('Pool: capture/release', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  const { item: item1 } = await pool.capture();
  test.strictSame(item1, obj1);
  const { item: item2 } = await pool.capture();
  test.strictSame(item2, obj2);
  const { item: item3, release } = await pool.capture();
  test.strictSame(item3, obj3);

  release();
  const { item: item4 } = await pool.capture();
  test.strictSame(item4, obj3);
  test.end();
});

metatests.test('Pool: wait for release', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const { release: release1 } = await pool.capture();
  const { release: release2 } = await pool.capture();

  pool.capture().then(({ item: item3 }) => {
    test.strictSame(item3, obj2);
  });
  pool.capture().then(({ item: item4 }) => {
    test.strictSame(item4, obj1);
  });

  release2();
  release1();
  test.end();
});

metatests.test('Pool: wait timeout', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const { item: item1 } = await pool.capture();
  test.strictSame(item1, obj1);
  const { item: item2, release: release2 } = await pool.capture();
  test.strictSame(item2, obj2);

  pool.capture().then(({ item: item3 }) => {
    test.strictSame(item3, obj2);
  });
  pool.capture().catch((err) => {
    test.strictSame(err.message, 'Error: Pool: next item timeout');
  });

  release2();
  test.end();
});

metatests.test('Pool: prevent infinite loop', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  await pool.next();
  const { item: item1 } = await pool.capture();
  test.strictSame(item1, obj2);
  await pool.next();
  const { item: item2 } = await pool.capture();
  test.strictSame(item2, obj1);

  test.end();
});
