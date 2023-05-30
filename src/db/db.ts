import {
  IDatabase, IDatabaseConfig, IDatabaseConnection,
  IDatabaseQueries, ITransaction, TQuery,
} from './types/types';
import { DatabaseError } from './errors';
import { readQueries } from './utils';
import { Transaction } from './transaction';

class Database implements IDatabase {
  private config: IDatabaseConfig;
  private connection?: IDatabaseConnection;
  private queries?: IDatabaseQueries;

  constructor(config: IDatabaseConfig) {
    this.config = config;
    this.sqlToQuery = this.sqlToQuery.bind(this);
  }

  async init() {
    const { connectionPath, connection: connectionConfig } = this.config;
    const Connection = require(connectionPath);
    this.connection = new Connection(connectionConfig);
    try {
      await this.connection!.connect();
    } catch (e: any) {
      logger.error(e);
      throw new DatabaseError('DB_CONNECTION_ERROR');
    }

    try {
      const { queriesPath } = this.config;
      const queries = await readQueries(queriesPath, this.sqlToQuery);
      this.queries = queries as unknown as IDatabaseQueries;
    } catch (e: any) {
      logger.error(e);
      throw new DatabaseError('DB_INIT_ERROR');
    }
    return this;
  }

  disconnect() {
    this.connection?.disconnect();
  }

  getQueries() {
    if (!this.queries) throw new DatabaseError('DB_INIT_ERROR');
    return this.queries;
  }

  async startTransaction(): Promise<ITransaction> {
    try {
      const connection = await this.connection!.getTransactionConnection();
      return new Transaction(connection, this.queries!);
    } catch (e) {
      logger.error(e);
      throw new DatabaseError('DB_CONNECTION_ERROR');
    }
  }

  private sqlToQuery(sql: string, pathname: string): TQuery {
    return async (params, connection) => {
      try {
        if (connection) return await connection.query(sql, params);
        return await this.connection!.query(sql, params);
      } catch (e: any) {
        logger.error(e, 'QUERY: ', pathname, sql, '\n', 'PARAMS: ', params);
        throw new DatabaseError('DB_QUERY_ERROR');
      }
    };
  }
}

export = Database;
