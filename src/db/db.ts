import path from 'node:path';
import fsp from 'node:fs/promises';
import { IDatabase, IDatabaseConnection, IQueries } from '../app/types';
import { Query } from './types';
import { DatabaseError, DatabaseErrorEnum, DatabaseErrorCode } from './errors';

class Database implements IDatabase {
  private connection?: IDatabaseConnection;

  async init() {
    try {
      await this.connection!.connect();
    } catch (e: any) {
      logger.error(e);
      throw this.error(DatabaseErrorEnum.E_DB_CONNECTION)
    }

    try {
      return await this.getQueries('js/db/queries');
    } catch (e: any) {
      logger.error(e);
      throw this.error(DatabaseErrorEnum.E_DB_INIT);
    }
  }

  setConnection(connection: IDatabaseConnection) {
    this.connection = connection;
    return this;
  }

  private async getQueries(dirPath: string): Promise<IQueries> {
    const query: IQueries = {};
    const queryPath = path.resolve(dirPath);
    const dir = await fsp.opendir(queryPath);
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (item.isFile()) {
        if (ext !== '.js') continue;
        const filePath = path.join(queryPath, name);
        const queries = this.createQueries(filePath);
        if (name === 'index') Object.assign(query, queries)
        else query[name] = queries;
      } else {
        const dirPath = path.join(queryPath, name);
        query[name] = await this.getQueries(dirPath);
      }
    }
    return query;
  }

  private createQueries(filePath: string): IQueries {
    const moduleExport = require(filePath);
    return Object
      .keys(moduleExport)
      .reduce((queries: IQueries, key: string) => {
        queries[key] = this.sqlToQuery(moduleExport[key]);
        return queries;
      }, {} as IQueries);
  }  

  private sqlToQuery(sql: string): Query {
    return async (params) => {
      try {
        return await this.connection!.query(sql, params);
      } catch (e: any) {
        logger.error(e);
        throw this.error(DatabaseErrorEnum.E_DB_QUERY);
      }
    };
  }

  error(code: DatabaseErrorCode, message?: string) {
    return new DatabaseError(code, message);
  }
}

export = new Database();
