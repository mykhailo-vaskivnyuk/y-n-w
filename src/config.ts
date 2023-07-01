/* eslint-disable max-lines */
import { resolve } from 'node:path';
import { IConfig } from './types/config.types';
import { BUILD_SRC_PATH } from './constants/constants';
import { createPathResolve } from './utils/utils';
import { getEnv } from './utils/env.utils';

const resolvePath  = createPathResolve(BUILD_SRC_PATH);
const {
  TRANSPORT: transport,
  HOST: host,
  PORT: port,
  DATABASE_URL: dbUrl,
  ...restEnv
} = getEnv();
const connection = {
  heroku: {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  },
  local: {
    host,
    port: 5432,
    database: 'merega',
    user: 'merega',
    password: 'merega',
  },
}[dbUrl ? 'heroku' : 'local'];


const config: IConfig = {
  env: restEnv,
  logger: {
    path: resolvePath('logger/logger'),
    level: 'DEBUG',
    target: 'console',
  },
  database: {
    path: resolvePath('db/db'),
    queriesPath: resolvePath('db/queries'),
    connectionPath: resolvePath('db/connection/pg'),
    connection,
  },
  router: {
    path: resolvePath('router/router'),
    apiPath: resolvePath('api'),
    servicesPath: resolvePath('services'),
    modulesPath: resolvePath('router/modules'),
    clientApiPath: resolve('src/client/common/server/client.api.ts'),
    services: ['mailService', 'chatService'],
    inputModules: [
      'setSession',
      'checkAuthorized',
      'getStream',
      'validateInput',
      'setUserNet',
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
    tasks: [{
      names: ['member', 'disconnectUnactive'],
      time: 86_400_000,
      interval: 86_400_000,
      params: { monthAgo: 2 },
    }, {
      names: ['member', 'disconnectNotVote'],
      time: 86_400_000,
      interval: 86_400_000,
      params: { monthAgo: 2 },
    }, {
      names: ['net', 'board', 'clear'],
      time: 86_400_000,
      interval: 86_400_000,
      params: { weekAgo: 0 },
    }],
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
      modulesPath: resolvePath('server/ws/modules'),
      resModules: ['sendResponse', 'sendChatMessage'],
    },
    link: {
      path: resolvePath('server/link/link'),
    },
    tg: {
      path: resolvePath('server/tg/tg'),
      token: restEnv.TG_BOT_TOKEN,
      user_name: 'u_n_w_bot',
    }
  },
};

export = config;
