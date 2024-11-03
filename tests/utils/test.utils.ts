/* eslint-disable max-lines */
import { mock } from 'node:test';
import { IConfig } from '../../src/types/config.types';
import { TTransport } from '../../src/server/types';
import { TFetch } from '../../src/client/common/client/connection/types';
import { ITestCase, ITestRunnerData } from '../types/types';
import { getHttpConnection as http } from '../client/http';
import { getWsConnection as ws } from '../client/ws';
import { getLinkConnection as link } from '../client/link';
import originConfig from '../../src/config';
import App from '../../src/app/app';
import { runScript } from './utils';
import { setToGlobal } from '../../src/app/methods/utils';

const getConnection = (
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

const getConfig = (
  testConfig: Partial<IConfig> = {},
  transport: TTransport,
) => {
  const config: IConfig = {
    ...originConfig,
    inConnection: {
      ...originConfig.inConnection,
      http: {
        ...originConfig.inConnection.http,
        port: 4000,
      },
      transport,
    },
    env: {
      ...originConfig.env,
      MAIL_CONFIRM_OFF: true,
      INVITE_CONFIRM: false,
    },
    logger: {
      ...originConfig.logger,
      level: 'WARN',
    },
  };
  return Object.assign(config, testConfig);
};

export const prepareTest = async (testCase: ITestCase) => {
  /* data */
  const {
    title,
    connection: transport,
    caseUnits,
    config: testConfig = {},
  } = testCase;

  const config = getConfig(testConfig, transport);

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
  };

  return { testRunnerData, finalize };
};
