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
  async (testData: ITestData): Promise<[ITestCase, number][]> => {
    const script = `sh tests/db/${testData.dbData}.sh`;
    await runScript(script, { showLog: false });
    const casesTree = await getCasesTree();
    const { connCount, cases } = testData;
    const stateArr = Array(connCount).fill(0).map(() => ({}));
    return cases(casesTree as any).map((item) => {
      const itemArr = Array.isArray(item) ? item : [item] as const;
      const [getTestCase, connNumber = 0] = itemArr;
      return [getTestCase(stateArr[connNumber]!), connNumber];
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
  const testCases = await getTestCases(testData);

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
