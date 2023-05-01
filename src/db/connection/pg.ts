import pg from 'pg';
import { IDatabaseConfig, IDatabaseConnection } from '../types/types';

class Connection implements IDatabaseConnection {
  private pool;

  constructor(config: IDatabaseConfig['connection']) {
    this.pool = new pg.Pool(config);
  }

  async connect() {
    await this.pool.connect();
  }

  async query(sql: string, params: any[]): Promise<any[]> {
    const { rows } = await this.pool!.query(sql, params);
    return rows;
  }
}

export = Connection;
