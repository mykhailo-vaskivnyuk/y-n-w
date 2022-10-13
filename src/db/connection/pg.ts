import pg from 'pg';
import { IConfig, IDatabaseConnection } from '../../app/types';

class Connection implements IDatabaseConnection {
  private pool;

  constructor(config: IConfig['database']['connection']) {
    this.pool = new pg.Pool(config);
  }

  async connect() {
    await this.pool.connect();
  }

  query<T extends any[]>(sql: string, params: T): Promise<any> {
    return this.pool!
      .query(sql, params)
      .then((result) => result.rows);
  }
}

export = Connection;
