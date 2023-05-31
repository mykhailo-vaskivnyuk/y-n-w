import { TTransport } from '../../src/server/types';
import { config } from '../config';
import { ITestCasesTree } from '../types/test.cases.types';
import { ITestData } from '../types/types';
import { createCases } from './create.cases';
import { runScript } from './utils';
import { getHttpConnection } from '../client/http';
import { getWsConnection } from '../client/ws';
import appConfig from '../../src/config';
import App from '../../src/app/app';
import { delay } from '../../src/client/common/client/connection/utils';
import { getLinkConnection } from '../client/link';

appConfig.logger.level = 'ERROR';

export const getTestCases = async (testData: ITestData, state: any) => {
  const script = `sh tests/db/${testData.dbData}.sh`;
  await runScript(script);
  const casesTree = await
    createCases(config.casesPath) as unknown as ITestCasesTree;
  return testData.cases(casesTree).map((item) => item(state));
};

export const getConnection = (transport: TTransport, port: number) => {
  const map = {
    http: getHttpConnection(`${transport}://localhost:${port}/api/`),
    ws: getWsConnection(`${transport}://localhost:${port}/api/`, () => false, () => false, '123'),
    link: getLinkConnection(),
  };
  return map[transport];
};

export const prepareTest = async (testData: ITestData) => {
  const { port } = appConfig.inConnection.http;
  const { title, connection: transport } = testData;
  appConfig.inConnection.transport = transport;
  const [connection, closeConnection] = getConnection(transport, port);
  const state = {};
  const testCases = await getTestCases(testData, state);
  const testRunnerData = { title, connection, testCases };
  const app = new App(appConfig);

  const closeTest = async () => {
    closeConnection();
    await app.stop();
    await delay(5000);
  };

  await app.start();

  return { testRunnerData, closeTest };
};
