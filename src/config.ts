
import { resolve } from 'node:path';
import { env } from 'node:process';
import { IConfig } from './app/types';
import { BUILD_PATH } from './constants/constants';

const host = env.HOST || 'localhost';
const port = +(env.PORT || 8000);
const dbConectionType = env.DATABASE_URL ? 'heroku' : 'local';
const dbConnection = {
  heroku: {
    connectionString: env.DATABASE_URL || '',
    ssl: { rejectUnauthorized: false },
  },
  local: {
    host,
    port: 5432,
    database: 'merega',
    user: 'merega',
    password: 'merega',
  },
}[dbConectionType];

const config: IConfig = {
  envPath: '.env.json',
  logger: {
    path: resolve(BUILD_PATH, 'logger/logger'),
    level: 'DEBUG',
    target: 'console',
  },
  database: {
    path: resolve(BUILD_PATH, 'db/db'),
    queriesPath: resolve(BUILD_PATH, 'db/queries'),
    connection: {
      path: resolve(BUILD_PATH, 'db/connection/pg'),
      ...dbConnection,
    },
  },
  router: {
    path: resolve(BUILD_PATH, 'router/router'),
    apiPath: resolve(BUILD_PATH, 'api'),
    clientApiPath: 'src/client/common/api/client.api.ts',
    services: [
      'mailService',
    ],
    modules: [
      'setSession',
      'getStream',
      'validate',
    ],
    responseModules: ['validateResponse'],
    modulesConfig: {
      mailService: {
        service: 'gmail',
        auth: {
          user: 'm.vaskivnyuk@gmail.com',
          pass: 'okvjifqaumuznqlu',
        },
      },
    },
  },
  inConnection: {
    transport: 'http',
    http: {
      path: resolve(BUILD_PATH, 'server/http/http'),
      modulesPath: resolve(BUILD_PATH, 'server/http/modules'),
      paths: {
        public: 'public',
        api: 'api',
      },
      reqModules: [
        'allowCors',
        'setSession',
        'staticServer',
        'getOperation',
      ],
      resModules: ['sendResponse'],
      host,
      port,
    },
    ws: {
      path: resolve(BUILD_PATH, 'server/ws/ws'),
    },
  },
};

export = config;
