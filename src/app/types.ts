import { Readable } from 'node:stream';
import { IObject, TPrimitiv } from '../types/types';
import { IDatabaseConfig, IDatabaseQueries } from '../db/types';
import { IMailService, IRouterConfig } from '../router/types';
import { ILogger, ILoggerConfig } from '../logger/types';
import { IInputConnectionConfig } from '../server/types';

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
  };
  names: string[];
  data: {
    stream?: { type?: string; content: Readable };
    params: IParams;
  };
}

export type IParams = Record<string, TPrimitiv | IObject>;

export type TOperationResponse =
  | TPrimitiv
  | IObject
  | (IObject | TPrimitiv)[]
  | Readable;

export interface IGlobalMixins {
  execQuery: IDatabaseQueries;
  logger: ILogger;
  mailService: IMailService;
  env: ICleanedEnv;
}

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
  const mailService: IMailService;
  const env: ICleanedEnv;
}

export interface IModulesContext {
  execQuery: IDatabaseQueries;
  logger: ILogger;
}
