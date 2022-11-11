import { ILoggerConfig } from '../logger/types';
import { IDatabaseConfig } from '../db/types';
import { IRouterConfig } from '../router/types';
import { IInputConnectionConfig } from '../server/types';

export interface IConfig {
  env: ICleanedEnv;
  logger: ILoggerConfig;
  database: IDatabaseConfig;
  router: IRouterConfig;
  inConnection: IInputConnectionConfig;
}

export interface ICleanedEnv {
  DEV: boolean;
  RUN_ONCE: boolean;
  STATIC_UNAVAILABLE: boolean;
  API_UNAVAILABLE: boolean;
  EXIT_ON_ERROR: boolean;
}
export type CleanedEnvKeys = keyof ICleanedEnv;
