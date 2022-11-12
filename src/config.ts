
import { resolve } from 'node:path';
import { env } from 'node:process';
import { IConfig } from './types/config.types';
import { BUILD_PATH } from './constants/constants';
import { createPathResolve } from './utils/utils';
import { getEnv } from './utils/env.utils';

const resolvePath  = createPathResolve(BUILD_PATH);
const transport = env.TRANSPORT === 'http' ? 'http' : 'ws';
const host = env.HOST || 'localhost';
const port = +(env.PORT || 8000);
const dbConectionType = env.DATABASE_URL ? 'heroku' : 'local';
const DB_CONNECTION = {
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
};

const config: IConfig = {
  env: getEnv(),
  logger: {
    path: resolvePath('logger/logger'),
    level: 'DEBUG',
    target: 'console',
  },
  database: {
    path: resolvePath('db/db'),
    queriesPath: resolvePath('db/queries'),
    connection: {
      path: resolvePath('db/connection/pg'),
      ...DB_CONNECTION[dbConectionType],
    },
  },
  router: {
    path: resolvePath('router/router'),
    apiPath: resolvePath('api'),
    modulesPath: resolvePath('router/modules'),
    servicesPath: resolvePath('router/services'),
    clientApiPath: resolve('src/client/common/api/client.api.ts'),
    services: ['mailService'],
    inputModules: [
      'setSession',
      'getStream',
      'validateInput',
    ],
    outputModules: ['validateOutput'],
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
    transport,
    http: {
      path: resolvePath('server/http/http'),
      modulesPath: resolvePath('server/http/modules'),
      staticPath: resolve('public'),
      apiPathname: 'api',
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
      path: resolvePath('server/ws/ws'),
    },
  },
};

export = config;
