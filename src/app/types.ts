import { Readable } from 'node:stream';
import { IDatabaseQueries, TQuery } from '../db/types';

export interface IInputConnection {
  onOperation(cb: (operation: IOperation) => Promise<TOperationResponse>): this;
  start(): void;
}

export interface IOperation {
  names: string[];
  data: {
    stream?: { type: string | undefined; content: Readable };
    params: Record<string, unknown>;
  }
}

type TResponse =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | null;

export type TOperationResponse = TResponse | TResponse[] | Readable;

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<TOperationResponse>;
}

export interface IDatabase {
  init(): Promise<IQueries>;
  setConnection(connection: IDatabaseConnection): this;
}

export interface IDatabaseConnection {
  query<T extends any[]>(sql: string, params: T): Promise<any>;
  connect: () => Promise<void>;
}

export interface IQueries {
  [key: string]: TQuery | IQueries;
}

type LoggerMethod = <T>(object: T, ...message:string[]) => void;
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
