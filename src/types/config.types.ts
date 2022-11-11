import { ILoggerConfig } from '../logger/types';
import { IDatabaseConfig } from '../db/types';
import { IRouterConfig } from '../router/types';
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

export interface ICleanedEnv {
  STATIC_UNAVAILABLE: boolean;
  API_UNAVAILABLE: boolean;
  EXIT_ON_ERROR: boolean;
  RUN_ONCE: boolean;
  DEV: boolean;
}
export type CleanedEnvKeys = keyof ICleanedEnv;
