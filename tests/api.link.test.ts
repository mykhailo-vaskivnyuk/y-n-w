import test, { after } from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import appConfig from '../src/config';
import Connection from '../src/server/link/link';
import { getTestData } from './test.data';

appConfig.inConnection.transport = 'link';
appConfig.logger.level = 'FATAL';
const app = new App(appConfig);
const version = 'restore';

test('Test API over LINK', async (t) => {
  const state = {};
  const TEST_DATA = await getTestData(version, state);

  await app.start();
  after(() => app.shutdown());

  for (const { task, operations } of TEST_DATA) {
    await t.test(task, async (t) => {

      for (const operation of operations) {
        const { name, params, response: expected } = operation;
        await t.test(async () => {

          const actual = await Connection.handleOperation({
            options: {
              sessionKey: 'sessionKey',
              origin: 'origin',
            },
            names: name.split('/'),
            data: { params },
          });
          assert.deepEqual(actual, expected);
        });
      }
    });
  }
});
