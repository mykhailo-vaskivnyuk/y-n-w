import { ICleanedEnv, IConfig } from '../types/config.types';
import { ILogger } from '../logger/types';
import { IDatabaseQueries } from '../db/types';
import { IMailService, IRouter } from '../router/types';
import { IInputConnection } from '../server/types';
import App from './app';

export type IAppThis = App & {
  config: IConfig;
  env: ICleanedEnv;
  logger?: ILogger;
  router?: IRouter;
  server?: IInputConnection;
  shutdown: () => Promise<void>;
  setInputConnection: () => Promise<IAppThis>;
};

export interface IRouterContext {
  execQuery: IDatabaseQueries;
  logger: ILogger;
}

export interface IGlobalMixins {
  execQuery: IDatabaseQueries;
  logger: ILogger;
  mailService: IMailService;
}

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
  const mailService: IMailService;
}
