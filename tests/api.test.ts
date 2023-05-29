import path from 'path';
import test, { after } from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import appConfig from '../src/config';
import Connection from './connection/link';
import { createCases } from './utils/create.cases';
import { config } from './config';
import { ITestCasesTree } from './types/test.cases.types';
import { getTestData } from './test.data';

const connectionPath = path.join(__dirname, './connection/link');
appConfig.inConnection.http.path = connectionPath;
appConfig.inConnection.ws.path = connectionPath;
appConfig.logger.level = 'FATAL';

const options =  {
  sessionKey: 'sessionKey',
  origin: 'origin',
};

const state = {};

test('Test API', async (t) => {
  const TEST_DATA = await getTestData('restore', state);

  const app = new App(appConfig);
  await app.start();
  after(() => app.shutdown());

  for (const { task, operations } of TEST_DATA) {
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
