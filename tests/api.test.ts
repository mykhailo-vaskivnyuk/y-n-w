import path from 'path';
import test, { after } from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import config from '../src/config';
import HttpConnection from './mock/connection';
import { API_TEST_DATA } from './api.test.data';

config.inConnection.http.path = path.join(__dirname, './mock/connection'),
config.inConnection.ws.path = config.inConnection.http.path;
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

          const actual = await HttpConnection.handleOperation({
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

// describe('Test API', async () => {
//   await app.start();
//   after((done) => app.shutdown().then(() => done()));
//   for (const test of API_TEST_DATA) {
//     it(test.it, async (t) => {
//       for (const operation of test.operations) {
//         await t.test(async () => {
//           const result = await HttpConnection.handleOperation({
//             options,
//             names: operation[0].split('/'),
//             data: { params: operation[1] },
//           });
//           assert.strictEqual(result, operation[2]);
//         });
//       }
//     });
//   }
// });
