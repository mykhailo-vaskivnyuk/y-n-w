import { LOGGER_LEVEL, LOGGER_TARGET } from './logger/logger';
import { MODULES_ENUM } from './router/router';

const buildPath = './js';
const host = 'localhost';

export = {
  logger: {
    level: LOGGER_LEVEL.DEBUG,
    target: LOGGER_TARGET.CONSOLE,
  },
  database: {
    queriesPath: buildPath + '/db/queries',
    connection: {
      host,
      port: 5432,
      database: 'merega',
      user: 'merega',
      password: 'merega',
    },
  },
  router: {
    apiPath: buildPath + '/api',
    modules: [
      [MODULES_ENUM.setSession, true] as const,
      [MODULES_ENUM.getStream, true] as const,
      [MODULES_ENUM.validate, true] as const,
    ],
  },
  inConnection: {
    http: {
      host,
      port: 8000,
    },
  },
};
