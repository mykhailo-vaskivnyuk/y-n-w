import pg, { QueryResultRow } from 'pg';
import {
  IConnectionInstance, IDatabaseConfig, IDatabaseConnection,
} from '../types/types';

class Connection implements IDatabaseConnection {
  private pool;

  constructor(config: IDatabaseConfig['connection']) {
    this.pool = new pg.Pool(config);
  }

  async connect() {
    await this.pool.connect();
  }

  async query(sql: string, params: any[]): Promise<QueryResultRow> {
    const { rows } = await this.pool!.query(sql, params);
    return rows;
  }

  async startTransaction(): Promise<IConnectionInstance> {
    const client = await this.pool.connect();
    await client.query('BEGIN;');
    const query =
      async (sql: string, params: any[]): Promise<QueryResultRow> => {
        const { rows } = await client.query(sql, params);
        return rows;
      };
    const finalize = () => {
      client.query('COMMIT;');
      client.release();
    };
    const cancel = () => {
      client.query('ROLLBACK;');
      client.release();
    };
    return { query, finalize, cancel };
  }
}

export = Connection;
