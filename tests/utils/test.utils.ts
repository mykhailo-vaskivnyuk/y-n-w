import { mock } from 'node:test';
import { TTransport } from '../../src/server/types';
import { TFetch } from '../../src/client/common/client/connection/types';
import { ITestData, ITestRunnerData } from '../types/types';
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

export const prepareTest = async (testData: ITestData) => {
  /* data */
  const { logger, inConnection } = config;
  const { port } = inConnection.http;
  const { title, connection: transport, connCount = 1, cases } = testData;
  logger.level = 'ERROR';
  inConnection.transport = transport;

  /* db */
  const script = `sh tests/db/${testData.dbDataFile}`;
  await runScript(script, { showLog: false });
  const { database } = config;
  const Database = require(database.path);
  const db = await new Database(database).init();
  setToGlobal('execQuery', db.getQueries());

  /* connections */
  const connections: TFetch[] = [];
  const closeConnections: (() => void)[] = [];
  const onConnMessage: ((data: any) => void)[] = [];
  for (let i = 0; i < connCount; i++) {
    const onMessage = () => undefined;
    const onMessageMock = mock.fn(onMessage);
    onConnMessage.push(onMessageMock);
    const [
      connection,
      closeConnection,
    ] = getConnection(transport, port, onMessageMock);
    connections.push(connection);
    closeConnections.push(closeConnection);
  }

  /* testCases */
  const testCases = cases.map((item) => {
    if (Array.isArray(item)) return item;
    return [item, 0] as const;
  });

  /* app */
  const app = new App(config);
  await app.start();

  /* result */
  const testRunnerData =
    { title, connections, onConnMessage, testCases } as ITestRunnerData;
  const finalize = async () => {
    closeConnections.forEach((fn) => fn());
    await app.stop();
    await db.disconnect();
  };

  return { testRunnerData, finalize };
};
