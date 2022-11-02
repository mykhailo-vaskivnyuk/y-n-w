import { format } from 'node:util';
import { Readable } from 'node:stream';
import { IObject, TPrimitiv } from '../types/types';
import { IDatabaseQueries, TQuery } from '../db/types';
import { ILoggerConfig } from '../logger/types';
import { HTTP_MODULES } from '../server/http/http';
import { MODULES, MODULES_RESPONSE } from '../router/constants';

export interface IConfig {
  logger: ILoggerConfig;
  database: IDatabaseConfig;
  router: IRouterConfig;
  inConnection: IInputConnectionConfig;
}

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

export type LoggerClass = new(config: ILoggerConfig) => ILogger;

export interface IDatabase {
  init(): Promise<IDatabaseQueries>;
  setConnection(Connection: DatabaseConnectionClass): this;
}

export interface IDatabaseConnection {
  connect(): Promise<void>;
  query<T extends any[]>(sql: string, params: T): Promise<any>;
}

export interface IDatabaseConfig {
  path: string;
  queriesPath: string;
  connection: { path: string} & Partial<{
    connectionString: string,
    ssl: {
      rejectUnauthorized: boolean,
    },
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  }>;
}

export type DatabaseConnectionClass =
  new(config: IDatabaseConfig['connection']) => IDatabaseConnection;

export interface IQueries {
  [key: string]: TQuery | IQueries;
}

export type IParams = Record<string, unknown>;

export interface IOperation {
  options: {
    sessionKey: string;
    origin: string;
  };
  names: string[];
  data: {
    stream?: { type: string | undefined; content: Readable };
    params: IParams;
  };
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

export interface IRouterConfig {
  path: string;
  apiPath: string;
  clientApiPath: string;
  modules: (keyof typeof MODULES)[];
  responseModules: (keyof typeof MODULES_RESPONSE)[];
  modulesConfig: {
    [key in (keyof typeof MODULES | keyof typeof MODULES_RESPONSE)]?: Record<string, any>;
  };
}

export type RouterClass = new(config: IRouterConfig) => IRouter;

export interface IInputConnection {
  onOperation(fn:
    (operation: IOperation) => Promise<TOperationResponse>
  ): this;
  start(): Promise<void>;
}

export interface IInputConnectionConfig {
  transport: 'http' | 'ws';
  http: {
    path: string;
    paths: {
      public: string;
      api: string;
    };
    modules: (keyof typeof HTTP_MODULES)[];
    host: string;
    port: number;
  };
  ws: {
    path: string;
    host: string;
    port: number;
  };
}

export type InputConnectionClass =
  new(config: IInputConnectionConfig) => IInputConnection;

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
}

export interface IModulesContext {
  execQuery: IDatabaseQueries;
}
