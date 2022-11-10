import { Readable } from 'node:stream';
import { IObject, TPrimitiv } from '../types/types';
import { IDatabaseConfig, IDatabaseQueries } from '../db/types';
import { IMailService, IRouter, IRouterConfig } from '../router/types';
import { ILogger, ILoggerConfig } from '../logger/types';
import { IInputConnection, IInputConnectionConfig } from '../server/types';
import { ReqMimeTypesKeys } from '../server/http/constants';
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

export interface IConfig {
  envPath: string,
  logger: ILoggerConfig;
  database: IDatabaseConfig;
  router: IRouterConfig;
  inConnection: IInputConnectionConfig;
}

export interface IEnv {
  STATIC_UNAVAILABLE: string;
  API_UNAVAILABLE: string;
  EXIT_ON_ERROR: string;
}
export const EnvValuesMap = {
  true: true,
  false: false,
};
export type EnvValuesKeys = keyof typeof EnvValuesMap;
export interface ICleanedEnv {
  STATIC_UNAVAILABLE: boolean;
  API_UNAVAILABLE: boolean;
  EXIT_ON_ERROR: boolean;
  RUN_ONCE: boolean;
  DEV: boolean;
}
export type CleanedEnvKeys = keyof ICleanedEnv;

export interface IOperation {
  options: {
    sessionKey: string;
    origin: string;
    requestId?: number;
    pathname?: string;
  };
  names: string[];
  data: {
    stream?: { type?: ReqMimeTypesKeys; content: Readable };
    params: IParams;
  };
}
export type IParams = Record<string, TPrimitiv | IObject>;

export type TOperationResponse =
  | TPrimitiv
  | IObject
  | (IObject | TPrimitiv)[]
  | Readable;

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
