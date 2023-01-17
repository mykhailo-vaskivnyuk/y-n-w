import { IConfig } from '../types/config.types';
import { ILogger } from '../logger/types';
import { IDatabaseQueries } from '../db/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/types';
import { IMailService } from '../services/mail/types';
import { ChatService } from '../services/chat/chat';
import App from './app';

export type IAppThis = App & {
  config: IConfig;
  logger?: ILogger;
  router?: IRouter;
  server?: IInputConnection;
  shutdown: () => Promise<void>;
  setInputConnection: () => Promise<IAppThis>;
};

export interface IRouterContext {
  execQuery: IDatabaseQueries;
  logger: ILogger;
  console?: typeof console;
  env?: IConfig['env'];
}

export interface IGlobalMixins {
  execQuery: IDatabaseQueries;
  logger: ILogger;
  mailService: IMailService;
  chatService: ChatService;
  env: IConfig['env'];
}

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
  const mailService: IMailService;
  const chatService: ChatService;
  const env: IConfig['env'];
}
