import test from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import appConfig from '../src/config';
import { getTestData } from './test.data.new';
import { getConnection as getHttpConnection } from './connection/http';
import { getConnection as getWsConnection } from './connection/ws';
import LinkConnection from '../src/server/link/link';
import { TEST_DATA_ARR } from './test.data.new';
import { delay } from '../src/client/common/client/connection/utils';
import { ITestCase } from './types/types';
import { TFetch } from '../src/client/common/client/connection/types';
import { TTransport } from '../src/server/types';

appConfig.logger.level = 'ERROR';
const { port } = appConfig.inConnection.http;

const runTest = (name: string, connection: TFetch, testCases: ITestCase[]) =>
  test(name, async (t) => {
    for (const { task, operations } of testCases) {
      await t.test(task, async (t) => {
        for (const operation of operations) {
          const { name, params, response: expected } = operation;
          await t.test(async () => {
            const actual = await connection(name, params);
            assert.deepEqual(actual, expected);
          });
        }
      });
    }
  });

const getConnection = (transport: TTransport) => {
  const map = {
    http: [getHttpConnection(`${transport}://localhost:${port}/api/`), () => false] as const,
    ws: getWsConnection(`${transport}://localhost:${port}/api/`, () => false, () => false, '123'),
    link: [LinkConnection.handleRequest, () => false] as const,
  };
  return map[transport];
};

const t = async () => {
  for (const testData of TEST_DATA_ARR) {
    const { name, connection: transport } = testData;
    appConfig.inConnection.transport = transport;
    const state = {};
    const testCases = await getTestData(testData, state);
    const app = new App(appConfig);
    await app.start();
    const [connection, closeConnection] = getConnection(transport);
    await runTest(name, connection, testCases);
    closeConnection();
    await app.stop();
    await delay(5000);
  }
};

t();
