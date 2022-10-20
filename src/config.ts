
import path from 'node:path';
import { LOGGER_LEVEL, LOGGER_TARGET } from './logger/types';
import { MODULES_ENUM } from './router/router';

const buildPath = 'js';
const host = process.env.HOST || 'localhost';
const databaseConnection = {
  heroku: {
    connectionString: process.env.DATABASE_URL || '',
    ssl: {
      rejectUnauthorized: false,
    },
  },
  local: {
    host,
    port: 5432,
    database: 'merega',
    user: 'merega',
    password: 'merega',
  },
};

export = {
  logger: {
    level: LOGGER_LEVEL.DEBUG,
    target: LOGGER_TARGET.CONSOLE,
  },
  database: {
    queriesPath: path.join(buildPath, 'db/queries'),
    connection: databaseConnection[
      process.env.DATABASE_URL ? 'heroku' : 'local'
    ],
  },
  router: {
    apiPath: path.join(buildPath, 'api'),
    clientApiPath: 'src/client/client.api.ts',
    modules: [
      MODULES_ENUM.setSession,
      MODULES_ENUM.getStream,
      MODULES_ENUM.validate,
      MODULES_ENUM.setMail,
    ],
    modulesConfig: {
      [MODULES_ENUM.setMail]: {
        service: 'gmail',
        auth: {
          user: 'm.vaskivnyuk@gmail.com',
          pass: 'jnvmldmwaiadoiwj',
        },
      },
    },
  },
  inConnection: {
    path: {
      public: 'public',
      api: 'api',
    },
    http: {
      host,
      port: +(process.env.PORT || 8000),
    },
  },
};
