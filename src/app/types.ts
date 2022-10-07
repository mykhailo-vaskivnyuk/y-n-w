import { DatabaseError, DatabaseErrorCode } from '../db/errors';
import { IDatabaseQueries, Query } from '../db/types';
import { RouterError, RouterErrorCode } from '../router/errors';
import { ServerError, ServerErrorCode } from '../server/errors';

export interface IInputConnection {
  onOperation: (cb: (operation: IOperation) => Promise<IOperationResponce>) => this;
  start(): void;
  error(code: ServerErrorCode, message?: string): ServerError;
}

export interface IOperation {
  names: string[];
  data: Record<string, unknown>;
}

export type IOperationResponce = string | boolean | any[] | Record<string, unknown>;

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<IOperationResponce>;
  error(code: RouterErrorCode, message?: string): RouterError;
}

export interface IDatabase {
  init(): Promise<IQueries>;
  setConnection(connection: IDatabaseConnection): this;
  error(code: DatabaseErrorCode, message?: string): DatabaseError;
}

export interface IDatabaseConnection {
  query(sql: string, params: any[]): Promise<any[]>;
  connect: () => Promise<void>;
}

export interface IQueries {
  [key: string]: Query | IQueries;
}

export type LoggerObject = string | Record<string, unknown>;
export type LoggerMethod = (object: LoggerObject, method?: string) => void;
export type LoggerMethodError = (object: Error | LoggerObject, method?: string) => void;

export interface ILogger {
  debug: LoggerMethod;
  info: LoggerMethod;
  warn: LoggerMethod;
  error: LoggerMethodError;
  fatal: LoggerMethodError;
}

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
}
