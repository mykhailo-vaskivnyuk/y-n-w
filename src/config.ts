
import { LOGGER_LEVEL, LOGGER_TARGET } from './logger/types';
import { MODULES_ENUM } from './router/router';

const buildPath = './js';
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
    queriesPath: buildPath + '/db/queries',
    connection: databaseConnection[
      process.env.DATABASE_URL ? 'heroku' : 'local'
    ],
  },
  router: {
    apiPath: buildPath + '/api',
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
    http: {
      host,
      port: +(process.env.PORT || 8000),
    },
  },
};
