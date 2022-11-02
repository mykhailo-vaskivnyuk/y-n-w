import pg from 'pg';
import { IDatabaseConfig, IDatabaseConnection } from '../../app/types';

class Connection implements IDatabaseConnection {
  private pool;

  constructor(config: IDatabaseConfig['connection']) {
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

export default Connection;
