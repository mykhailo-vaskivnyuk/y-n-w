import { IConfig } from '../types/config.types';
import { ILogger } from '../logger/types';
import { IDatabase, IDatabaseQueries } from '../db/types/types';
import { IRouter } from '../router/types';
import { IInputConnection, IConnectionService } from '../server/types';
import { IMailService } from '../services/mail/types';
import { ChatService } from '../services/chat/chat';
import App from './app';

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
  mailService: IMailService;
  chatService: ChatService;
  env: IConfig['env'];
}

declare global {
  const execQuery: IDatabaseQueries;
  const startTransaction: IDatabase['startTransaction'];
  const logger: ILogger;
  const connectionService: IConnectionService;
  const messengerService: IConnectionService;
  const mailService: IMailService;
  const chatService: ChatService;
  const env: IConfig['env'];
}
