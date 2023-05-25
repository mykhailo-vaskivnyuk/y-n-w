import path from 'path';
import test, { after } from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import config from '../src/config';
import Connection from './mock/connection';
import { API_TEST_DATA } from './api.test.data';

const connectionPath = path.join(__dirname, './mock/connection');
config.inConnection.http.path = connectionPath;
config.inConnection.ws.path = connectionPath;
config.logger.level = 'FATAL';

const options =  {
  sessionKey: 'sessionKey',
  origin: 'origin',
};
const app = new App(config);

test('Test API', async (t) => {
  await app.start();
  after(() => app.shutdown());

  for (const { task, operations } of API_TEST_DATA) {
    await t.test(task, async (t) => {

      for (const operation of operations) {
        const { name, params, response: expected } = operation;
        await t.test(async () => {

          const actual = await Connection.handleOperation({
            options,
            names: name.split('/'),
            data: { params },
          });
          assert.deepEqual(actual, expected);
        });
      }
    });
  }
});

