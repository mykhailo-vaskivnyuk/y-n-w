import path from 'node:path';
import fsp from 'node:fs/promises';
import { TQueriesModule, TQuery } from './types';
import { DatabaseConnectionClass, IDatabase, IDatabaseConfig, IDatabaseConnection, IQueries } from '../app/types';
import { DatabaseError, DatabaseErrorEnum } from './errors';

class Database implements IDatabase {
  private config: IDatabaseConfig;
  private connection?: IDatabaseConnection;

  constructor(config: IDatabaseConfig) {
    this.config = config;
  }

  async init() {
    try {
      await this.connection!.connect();
    } catch (e: any) {
      logger.error(e);
      throw new DatabaseError(DatabaseErrorEnum.E_DB_CONNECTION)
    }

    try {
      return await this.getQueries(this.config.queriesPath);
    } catch (e: any) {
      logger.error(e);
      throw new DatabaseError(DatabaseErrorEnum.E_DB_INIT);
    }
  }

  setConnection(Connection: DatabaseConnectionClass) {
    this.connection = new Connection(this.config.connection);
    return this;
  }

  private async getQueries(dirPath: string): Promise<IQueries> {
    const query: IQueries = {};
    const queryPath = path.resolve(dirPath);
    const dir = await fsp.opendir(queryPath);
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (item.isDirectory()) {
        const dirPath = path.join(queryPath, name);
        query[name] = await this.getQueries(dirPath);
        continue;
      }

      if (ext !== '.js') continue;

      const filePath = path.join(queryPath, name);
      const queries = this.createQueries(filePath);
      if (name === 'index') Object.assign(query, queries);
      else query[name] = queries;

    }
    return query;
  }

  private createQueries(filePath: string): IQueries | TQuery {
    const { default: defaultExport, ...restExport } = require(filePath);
    const moduleExport = (defaultExport || restExport) as TQueriesModule; 
    if (typeof moduleExport === 'string') {
      return this.sqlToQuery(moduleExport);
    }
    return Object
      .keys(moduleExport)
      .reduce<IQueries>((queries, key) => {
        queries[key] = this.sqlToQuery(moduleExport[key]!);
        return queries;
      }, {});
  }

  private sqlToQuery(sql: string): TQuery {
    return async (params) => {
      try {
        return await this.connection!.query(sql, params);
      } catch (e: any) {
        logger.error(e);
        throw new DatabaseError(DatabaseErrorEnum.E_DB_QUERY);
      }
    };
  }
}

export = Database;
