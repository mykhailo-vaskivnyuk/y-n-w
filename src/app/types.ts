import { IDbQueries, Query } from '../db/types';

export interface IConnection {
  onOperation: (cb: (operation: IOperation) => Promise<IOperationResponce>) => this;
  start(): void;
}

export interface IOperation {
  names: string[];
  data: Record<string, unknown>;
}

export type IOperationResponce = string | boolean | any[] | Record<string, unknown>;

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<IOperationResponce>;
}

export interface IDatabase {
  init(): Promise<IQueries>;
  setConnection(connection: IDatabaseConnection): this;
}

export interface IDatabaseConnection {
  query(sql: string, params: any[]): Promise<any[]>;
}

export interface IQueries {
  [key: string]: Query | IQueries;
}

export type LoggerMessage = string | Record<string, unknown>;

export interface ILogger {
  debug(message: LoggerMessage): void;
  info(message: LoggerMessage): void;
  warn(message: LoggerMessage): void;
  error(message: LoggerMessage | Error): void;
}

declare global {
  const execQuery: IDbQueries;
  const logger: ILogger;
}
