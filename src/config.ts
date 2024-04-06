/* eslint-disable max-lines */
import { resolve } from 'node:path';
import { IConfig } from './types/config.types';
import { BUILD_SRC_PATH } from './constants/constants';
import { createPathResolve } from './utils/utils';
import { getEnv } from './utils/env.utils';

const resolvePath = createPathResolve(BUILD_SRC_PATH);
const {
  TRANSPORT: transport,
  HOST: host,
  PORT: port,
  DATABASE_URL: dbUrl,
  ORIGIN: origin,
  STATIC_PATH: staticPath,
  LOGGER_COLORIZE: colorize,
  GMAIL: gmail,
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
    colorize,
  },
  database: {
    path: resolvePath('db/db'),
    queriesPath: resolvePath('db/queries'),
    connectionPath: resolvePath('db/connection/pg'),
    connection,
  },
  router: {
    path: resolvePath('controller/router'),
    apiPath: resolvePath('api'),
    servicesPath: resolvePath('services'),
    modulesPath: resolvePath('controller/modules'),
    clientApiPath: resolve('src/client/common/server/client.api.ts'),
    services: [
      'mailService',
      'chatService',
      'notificationService',
    ],
    inputModules: [
      'setSession',
      'checkAuthorized',
      'getStream',
      'validateInput',
      'setUserNet',
    ],
    outputModules: [
      'validateOutput',
    ],
    modulesConfig: {
      mailService: {
        service: 'gmail',
        auth: {
          user: 'm.vaskivnyuk@gmail.com',
          pass: gmail,
        },
      },
    },
    tasks: [{
      path: 'member/disconnectUnactive',
      params: { monthAgo: 2 },
      time: 86_400_000,
      interval: 86_400_000,
    }, {
      path: 'member/disconnectNotVote',
      params: { monthAgo: 2 },
      time: 86_400_000,
      interval: 86_400_000,
    }, {
      path: 'net/board/clear',
      params: { weekAgo: 0 },
      time: 86_400_000,
      interval: 86_400_000,
    }],
  },
  inConnection: {
    transport,
    http: {
      path: resolvePath('server/http/http'),
      modulesPath: resolvePath('server/http/modules'),
      staticPath: resolve(staticPath),
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
      user_name: restEnv.TG_BOT,
      origin,
    }
  },
};

export = config;
