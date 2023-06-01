import { TTransport } from '../../src/server/types';
import { ITestCase, ITestData } from '../types/types';
import { runScript } from './utils';
import { getHttpConnection as http } from '../client/http';
import { getWsConnection as ws } from '../client/ws';
import config from '../../src/config';
import App from '../../src/app/app';
import { delay } from '../../src/client/common/client/connection/utils';
import { getLinkConnection as link } from '../client/link';
import { getCasesTree } from './create.cases';
import { TFetch } from '../../src/client/common/client/connection/types';

export const getConnection = (transport: TTransport, port: number) => {
  const map = { http, ws, link };
  const url = `${transport}://localhost:${port}/api/`;
  const emptyFn = () => false;
  return map[transport](url, emptyFn, emptyFn);
};

export const getTestCases =
  async (testData: ITestData, state: any): Promise<[ITestCase, number][]> => {
    const script = `sh tests/db/${testData.dbData}.sh`;
    await runScript(script, { showLog: false });
    const casesTree = await getCasesTree();
    return testData.cases(casesTree as any).map(
      (item) => {
        if (Array.isArray(item)) {
          return [item[0](state), item[1]];
        }
        return [item(state), 0];
      });
  };

export const prepareTest = async (testData: ITestData) => {
  /* data */
  const { logger, inConnection } = config;
  const { port } = inConnection.http;
  const { title, connection: transport, connCount = 1 } = testData;
  logger.level = 'ERROR';
  inConnection.transport = transport;

  /* connections */
  const connections: TFetch[] = [];
  const closeConnections: Array<() => void> = [];
  for (let i = 0; i < connCount; i++) {
    const [connection, closeConnection] = getConnection(transport, port);
    connections.push(connection);
    closeConnections.push(closeConnection);
  }

  /* testCases */
  const state = {};
  const testCases = await getTestCases(testData, state);

  /* app */
  const app = new App(config);
  await app.start();

  /* result */
  const testRunnerData = { title, connections, testCases };
  const finalize = async () => {
    closeConnections.forEach((fn) => fn());
    await app.stop();
    await delay(5000);
  };

  return { testRunnerData, finalize };
};
