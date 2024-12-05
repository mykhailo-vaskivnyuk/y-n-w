import { ILoggerConfig } from '../logger/types';
import { IDatabaseConfig } from '../db/types/types';
import { IControllerConfig } from '../controller/types';
import { IInputConnectionConfig, TTransport } from '../server/types';

export interface IConfig {
  env: Partial<ICleanedEnv>;
  logger: ILoggerConfig;
  database: IDatabaseConfig;
  controller: IControllerConfig;
  inConnection: IInputConnectionConfig;
}

export interface ICleanedEnv {
  DEV: boolean;
  TEST: boolean;
  TRANSPORT: TTransport;
  HOST: string;
  PORT: number;
  DATABASE_URL: string;
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
  MAIL: 'google' | 'elastic';
  MAIL_HOST: '';
  MAIL_PORT: number;
  MAIL_USER: '';
  MAIL_PASSWORD: string;
  INVITE_CONFIRM: boolean;
  NOTIFICATION_INTERVAL: number;
}
export type CleanedEnvKeys = keyof ICleanedEnv;
