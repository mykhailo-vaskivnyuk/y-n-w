import { mock } from 'node:test';
import { TTransport } from '../../src/server/types';
import { TFetch } from '../../src/client/common/client/connection/types';
import { ITestCase, ITestRunnerData } from '../types/types';
import { getHttpConnection as http } from '../client/http';
import { getWsConnection as ws } from '../client/ws';
import { getLinkConnection as link } from '../client/link';
import config from '../../src/config';
import App from '../../src/app/app';
import { runScript } from './utils';
import { setToGlobal } from '../../src/app/methods/utils';

export const getConnection = (
  transport: TTransport,
  port: number,
  onMessage: (data: any) => void,
) => {
  const map = { http, ws, link };
  const url = `${transport}://localhost:${port}/api/`;
  const emptyFn = () => undefined;
  const [connection, closeConnection] = map[transport](url, emptyFn, onMessage);
  return [connection, closeConnection, onMessage] as const;
};

export const prepareTest = async (testCase: ITestCase) => {
  /* data */
  const originConfig = { ...config };
  const {
    title,
    connection: transport,
    caseUnits,
    config: testConfig,
  } = testCase;

  config.inConnection.http.port = 4000;
  config.logger.level = 'WARN';
  config.inConnection.transport = transport;
  config.env.MAIL_CONFIRM_OFF = true;
  config.env.INVITE_CONFIRM = false;
  Object.assign(config, testConfig);

  const { port } = config.inConnection.http;

  /* db */
  if (testCase.dbDataFile) {
    const script = `sh tests/db/${testCase.dbDataFile}`;
    await runScript(script, { showLog: false });
  }
  const { database } = config;
  const Database = require(database.path);
  const db = await new Database(database).init();
  setToGlobal('execQuery', db.getQueries());

  /* testUnits */
  const testUnits = caseUnits.map((item) => {
    if (Array.isArray(item)) return item;
    return [item, 0] as const;
  });
  const connCount = testUnits
    .reduce((a, [_, b]) => {
      if (b > a) return b;
      return a;
    }, 0) + 1;

  /* connections */
  const connections: TFetch[] = [];
  const closeConnections: (() => void)[] = [];
  const onMessage: ((data: any) => void)[] = [];
  for (let i = 0; i < connCount; i++) {
    const onMessageMock = mock.fn(() => undefined);
    onMessage.push(onMessageMock);
    const [
      connection,
      closeConnection,
    ] = getConnection(transport, port, onMessageMock);
    connections.push(connection);
    closeConnections.push(closeConnection);
  }

  /* app */
  const app = new App(config);
  await app.start();

  /* result */
  const testRunnerData = {
    title,
    connections,
    onMessage,
    testUnits,
  } as ITestRunnerData;
  const finalize = async () => {
    closeConnections.forEach((fn) => fn());
    await app.stop();
    await db.disconnect();
    Object.assign(config, originConfig);
  };

  return { testRunnerData, finalize };
};
