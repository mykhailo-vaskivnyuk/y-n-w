import { format } from 'node:util';
import { Readable } from 'node:stream';
import config from '../config';
import { IObject, TPrimitiv } from '../types';
import { IDatabaseQueries, TQuery } from '../db/types';

export type IConfig = typeof config;

export type TLoggerMethodName =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export type TLoggerParameters = Parameters<typeof format>;

export type TLoggerMethod =
  <T>(object: T, ...message: TLoggerParameters) => void;

export type ILogger = Record<TLoggerMethodName, TLoggerMethod>;

export type LoggerClass = new(config: IConfig['logger']) => ILogger;

export interface IDatabase {
  init(): Promise<IQueries>;
  setConnection(connection: IDatabaseConnection): this;
}

export interface IDatabaseConnection {
  connect(): Promise<void>;
  query<T extends any[]>(sql: string, params: T): Promise<any>;
}

export type DatabaseConnectionClass =
  new(config: IConfig['database']['connection']) => IDatabaseConnection;

export interface IQueries {
  [key: string]: TQuery | IQueries;
}

export type IParams = Record<string, unknown> & {
  sessionKey?: string;
};

export interface IOperation {
  names: string[];
  data: {
    stream?: { type: string | undefined; content: Readable };
    params: IParams;
  }
}

export type TOperationResponse =
  | TPrimitiv
  | IObject
  | (IObject | TPrimitiv)[]
  | Readable;

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<TOperationResponse>;
}

export type RouterClass = new(config: IConfig['router']) => IRouter;

export interface IInputConnection {
  onOperation(fn:
    (operation: IOperation) => Promise<TOperationResponse>
  ): this;
  start(): Promise<void>;
}

export type InputConnectionClass =
  new(config: IConfig['inConnection']) => IInputConnection;

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
}
