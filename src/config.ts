
import { LOGGER_LEVEL, LOGGER_TARGET } from './logger/types';
import { MODULES_ENUM } from './router/router';

const buildPath = './js';
const host = 'https://peaceful-chamber-69318.herokuapp.com/'; // 'localhost';

export = {
  logger: {
    level: LOGGER_LEVEL.DEBUG,
    target: LOGGER_TARGET.CONSOLE,
  },
  database: {
    queriesPath: buildPath + '/db/queries',
    connection: {
      connectionString: "postgres://pykbieusyvmwul:ca77f2d4221fb9fffc8001e977d4a2cdebe27b8e69bb1666254def09573ddc54@ec2-54-147-36-107.compute-1.amazonaws.com:5432/dde08bsdd14bdp", // process.env.HEROKU_POSTGRESQL_COBALT || '',
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
      port: 80,
    },
  },
};
