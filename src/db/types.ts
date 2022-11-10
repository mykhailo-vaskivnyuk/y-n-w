import { GetParamsTypes } from '../types/types';
import { IQueriesSession } from './queries/session';
import { IQueriesUser } from './queries/user/types';

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

export interface IDatabaseConnection {
  connect(): Promise<void>;
  query<T extends any[]>(sql: string, params: T): Promise<any>;
}

export interface IDatabase {
  init(): Promise<this>;
  getQueries(): IDatabaseQueries;
}

export interface IDatabaseQueries {
  user: IQueriesUser;
  session: IQueriesSession;
}

export interface IQueries {
  [key: string]: TQuery | IQueries;
}

export type TQuery<
  T extends [string, any][] = [string, any][],
  Q extends Record<string, any> = Record<string, any>,
> = (params: GetParamsTypes<T>) => Promise<Q[]>;

export type TQueriesModule = Record<string, string> | string;
