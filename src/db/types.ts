import { GetParamsTypes } from '../types/types';
import { IQueriesNet } from './queries/net';
import { IQueriesNode } from './queries/node';
import { IQueriesUser } from './queries/user';
import { IQueriesSession } from './queries/session';
import { IQueriesNodes } from './queries/nodes';
import { IQueriesNets } from './queries/nets';
import { IQueriesTest } from './queries/test';

export interface IDatabaseConfig {
  path: string;
  queriesPath: string;
  connectionPath: string
  connection: Partial<{
    connectionString: string;
    ssl: {
      rejectUnauthorized: boolean;
    };
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
  node: IQueriesNode;
  nodes: IQueriesNodes;
  net: IQueriesNet;
  nets: IQueriesNets;
  session: IQueriesSession;
  test: IQueriesTest;
}

export interface IQueries {
  [key: string]: TQuery | IQueries;
}

export type TQuery<
  T extends [string, any][] = [string, any][],
  Q extends Record<string, any> = Record<string, any>,
> = (params: GetParamsTypes<T>) => Promise<Q[]>;

export type TQueriesModule = Record<string, string> | string;
