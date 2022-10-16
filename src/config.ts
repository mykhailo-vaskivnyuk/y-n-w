
import { LOGGER_LEVEL, LOGGER_TARGET } from './logger/types';
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
      connectionString: process.env.DATABASE_URL || ' ',
      ssl: {
        rejectUnauthorized: false,
      },
      // local: {
      //   host: '192.168.31.176',
      //   port: 5432,
      //   database: 'merega',
      //   user: 'merega',
      //   password: 'merega',
      // },
    },
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
      port: 8000,
    },
  },
};
