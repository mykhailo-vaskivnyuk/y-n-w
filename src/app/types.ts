import { format } from 'node:util';
import { Readable } from 'node:stream';
import { IDatabaseQueries, TQuery } from '../db/types';

export interface IInputConnection {
  onOperation(cb: (operation: IOperation) => Promise<TOperationResponse>): this;
  start(): void;
}

export type IParams = Record<string, unknown> & {
  sessionId?: string;
};

export interface IOperation {
  names: string[];
  data: {
    stream?: { type: string | undefined; content: Readable };
    params: IParams;
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

export type TLoggerMethod = <T>(object: T, ...message: Parameters<typeof format>) => void;
type TLoggerMethodName =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';
export type ILogger = Record<TLoggerMethodName, TLoggerMethod>;

declare global {
  const execQuery: IDatabaseQueries;
  const logger: ILogger;
}
