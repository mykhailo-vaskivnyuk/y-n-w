import path from 'node:path';
import fsp from 'node:fs/promises';
import {
  IDatabase, IDatabaseConfig, IDatabaseConnection,
  IDatabaseQueries, IQueries, TQueriesModule, TQuery,
} from './types';
import { DatabaseError } from './errors';

class Database implements IDatabase {
  private config: IDatabaseConfig;
  private connection?: IDatabaseConnection;
  private queries?: IDatabaseQueries;

  constructor(config: IDatabaseConfig) {
    this.config = config;
  }

  async init() {
    const { connectionPath, connection } = this.config;
    const Connection = require(connectionPath);
    this.connection = new Connection(connection);
    try {
      await this.connection!.connect();
    } catch (e: any) {
      logger.error(e);
      throw new DatabaseError('DB_CONNECTION_ERROR');
    }

    try {
      const queries = await this.readQueries(this.config.queriesPath);
      this.queries = queries as unknown as IDatabaseQueries;
    } catch (e: any) {
      logger.error(e);
      throw new DatabaseError('DB_INIT_ERROR');
    }
    return this;
  }

  getQueries() {
    if (!this.queries) throw new DatabaseError('DB_INIT_ERROR');
    return this.queries;
  }

  private async readQueries(dirPath: string): Promise<IQueries> {
    const query: IQueries = {};
    const queryPath = path.resolve(dirPath);
    const dir = await fsp.opendir(queryPath);
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (item.isDirectory()) {
        const dirPath = path.join(queryPath, name);
        query[name] = await this.readQueries(dirPath);
        continue;
      }

      if (ext !== '.js') continue;

      const filePath = path.join(queryPath, item.name);
      const queries = this.createQueries(filePath);
      if (name === 'index') Object.assign(query, queries);
      else query[name] = queries;

    }
    // dir.close();
    return query;
  }

  private createQueries(filePath: string): IQueries | TQuery {
    let moduleExport = require(filePath);
    moduleExport = moduleExport.default || moduleExport as TQueriesModule;
    if (typeof moduleExport === 'string') {
      return this.sqlToQuery(moduleExport, filePath);
    }
    return Object
      .keys(moduleExport)
      .reduce<IQueries>((queries, key) => {
        queries[key] = this.sqlToQuery(
          moduleExport[key]!, filePath + '/' + key,
        );
        return queries;
      }, {});
  }

  private sqlToQuery(sql: string, pathname: string): TQuery {
    return async (params) => {
      try {
        return await this.connection!.query(sql, params);
      } catch (e: any) {
        logger.error(e, 'QUERY: ', pathname, sql, '\n', 'PARAMS: ', params);
        throw new DatabaseError('DB_QUERY_ERROR');
      }
    };
  }
}

export = Database;
