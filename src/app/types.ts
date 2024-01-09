import { IConfig } from '../types/config.types';
import { ILogger } from '../logger/types';
import { IDatabase, IDatabaseQueries } from '../db/types/types';
import { IRouter } from '../controller/types';
import { IInputConnection, IConnectionService } from '../server/types';
import { IMailService } from '../services/mail/types';
import { ChatService } from '../services/chat/chat';
import { NotificationService } from '../services/notification/notification';
import App from './app';
import { IDomain } from '../domain';

export type IAppThis = App & {
  config: IConfig;
  logger?: ILogger;
  router?: IRouter;
  server?: IInputConnection;
  apiServer?: IInputConnection;
  shutdown: () => Promise<void>;
  setInputConnection: () => Promise<IAppThis>;
};

export interface IRouterContext {
  execQuery: IDatabaseQueries;
  startTransaction: IDatabase['startTransaction'];
  logger: ILogger;
  connectionService: IConnectionService;
  messengerService: IConnectionService;
  console?: typeof console;
  env?: IConfig['env'];
}

export interface IGlobalMixins {
  execQuery: IDatabaseQueries;
  startTransaction: IDatabase['startTransaction'];
  logger: ILogger;
  connectionService: IConnectionService;
  messengerService: IConnectionService;
  cryptoService: typeof import('../utils/crypto');
  mailService: IMailService;
  chatService: ChatService;
  env: IConfig['env'];
  domain: IDomain;
}

declare global {
  const execQuery: IDatabaseQueries;
  const startTransaction: IDatabase['startTransaction'];
  const logger: ILogger;
  const connectionService: IConnectionService;
  const messengerService: IConnectionService;
  const cryptoService: typeof import('../utils/crypto');
  const mailService: IMailService;
  const chatService: ChatService;
  const notificationService: NotificationService;
  const env: IConfig['env'];
  const domain: IDomain;
}
