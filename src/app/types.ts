import { Readable } from 'node:stream';
import { IObject, TPrimitiv } from '../types/types';
import { IDatabaseConfig, IDatabaseQueries } from '../db/types';
import { IMailService, IRouterConfig } from '../router/types';
import { ILogger, ILoggerConfig } from '../logger/types';
import { IInputConnectionConfig } from '../server/http/types';

export interface IConfig {
  logger: ILoggerConfig;
  database: IDatabaseConfig;
  router: IRouterConfig;
  inConnection: IInputConnectionConfig;
}

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

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
  const mailService: IMailService;
}

export interface IModulesContext {
  execQuery: IDatabaseQueries;
  logger: ILogger;
}
