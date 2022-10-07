import { IDatabaseQueries, Query } from '../db/types';

export interface IInputConnection {
  onOperation(cb: (operation: IOperation) => Promise<IOperationResponce>): this;
  start(): void;
}

export interface IOperation {
  names: string[];
  data: Record<string, unknown>;
}

export type IOperationResponce = string | boolean | unknown[] | Record<string, unknown>;

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<IOperationResponce>;
}

export interface IDatabase {
  init(): Promise<IQueries>;
  setConnection(connection: IDatabaseConnection): this;
}

export interface IDatabaseConnection {
  query<T extends []>(sql: string, params: T): Promise<any>;
  connect: () => Promise<void>;
}

export interface IQueries {
  [key: string]: Query | IQueries;
}

type LoggerMethod = <T>(object: T, method?: string) => void;
type LoggerMethodName =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';
export type ILogger = Record<LoggerMethodName, LoggerMethod>;

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
}
