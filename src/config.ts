
import path from 'node:path';
import { IConfig } from './app/types';

const buildPath = 'js';
const host = process.env.HOST || 'localhost';
const port = +(process.env.PORT || 8000);
const dbConectionType = process.env.DATABASE_URL ? 'heroku' : 'local';
const dbConnection = {
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
}[dbConectionType];


const config: IConfig = {
  logger: {
    path: path.resolve(buildPath, 'logger/logger'),
    level: 'DEBUG',
    target: 'console',
  },
  database: {
    path: path.resolve(buildPath, 'db/db'),
    queriesPath: path.resolve(buildPath, 'db/queries'),
    connection: {
      path: path.resolve(buildPath, 'db/connection/pg'),
      ...dbConnection,
    },
  },
  router: {
    path: path.resolve(buildPath, 'router/router'),
    apiPath: path.resolve(buildPath, 'api'),
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
      path: path.resolve(buildPath, 'server/http/http'),
      paths: {
        public: 'public',
        api: 'api',
      },
      modules: ['allowCors', 'staticServer'],
      host,
      port,
    },
    ws: {
      path: path.resolve(buildPath, 'server/ws'),
      host,
      port,
    },
  },
};

export = config;
