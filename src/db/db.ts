import { IDatabase } from '../app/types';
import { IDatabaseConnection, IQueries, Query } from './types';
import path from 'node:path';
import fsp from 'node:fs/promises';
import connection from './connection/pg';

class Database implements IDatabase {
  private db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
  }

  init() {
    return this.getQueries('js/db/queries')
      .then((queries) => Object.assign(global, { DbQueries: queries }))
      .then(() => this);
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
      .reduce((queries: IQueries, key: string) => (
        queries[key] = this.sqlToQuery(moduleExport[key]),
        queries
      ), {} as IQueries);
  }  


  private sqlToQuery(sql: string): Query {
    return (params: any[]) => this.db.query(sql, params);
  }
}

export = new Database(connection);
