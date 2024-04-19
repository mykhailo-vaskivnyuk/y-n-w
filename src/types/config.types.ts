import { ILoggerConfig } from '../logger/types';
import { IDatabaseConfig } from '../db/types/types';
import { IRouterConfig } from '../controller/types';
import { IInputConnectionConfig, TTransport } from '../server/types';

export interface IConfig {
  env: Partial<ICleanedEnv>;
  logger: ILoggerConfig;
  database: IDatabaseConfig;
  router: IRouterConfig;
  inConnection: IInputConnectionConfig;
}

export interface ICleanedEnv {
  DEV: boolean;
  TRANSPORT: TTransport;
  HOST: string;
  PORT: number;
  DATABASE_URL : string;
  RUN_ONCE: boolean;
  STATIC_UNAVAILABLE: boolean;
  API_UNAVAILABLE: boolean;
  EXIT_ON_ERROR: boolean;
  MAIL_CONFIRM_OFF: boolean;
  TG_BOT: string;
  TG_BOT_TOKEN: string;
  ORIGIN: string;
  STATIC_PATH: string;
  LOGGER_COLORIZE: boolean;
  GMAIL: string;
  INVITE_CONFIRM: boolean;
}
export type CleanedEnvKeys = keyof ICleanedEnv;
