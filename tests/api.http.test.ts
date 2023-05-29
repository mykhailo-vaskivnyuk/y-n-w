import test, { after } from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import appConfig from '../src/config';
import { getTestData } from './test.data';
import { getConnection } from './connection/http';

appConfig.inConnection.transport = 'http';
appConfig.logger.level = 'FATAL';
const app = new App(appConfig);
const version = 'restore';
const { port } = appConfig.inConnection.http;
const connection = getConnection(`http://localhost:${port}/api`);

test('Test API over HTTP', async (t) => {
  const state = {};
  const TEST_DATA = await getTestData(version, state);

  await app.start();
  after(() => app.shutdown());

  for (const { task, operations } of TEST_DATA) {
    await t.test(task, async (t) => {

      for (const operation of operations) {
        const { name, params, response: expected } = operation;
        await t.test(async () => {

          const actual = await connection('/' + name, params);
          assert.deepEqual(actual, expected);
        });
      }
    });
  }
});
