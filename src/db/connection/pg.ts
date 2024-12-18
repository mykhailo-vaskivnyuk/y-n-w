import pg, { QueryResultRow } from 'pg';
import {
  ITransactionConnection,
  IDatabaseConfig,
  IDatabaseConnection,
} from '../types/types';

class Connection implements IDatabaseConnection {
  private pool;

  constructor(config: IDatabaseConfig['connection']) {
    this.pool = new pg.Pool(config);
  }

  async connect() {
    const client = await this.pool.connect();
    client.release();
  }

  disconnect(): void {
    this.pool.end();
  }

  async query(sql: string, params: any[]): Promise<QueryResultRow> {
    const { rows } = await this.pool!.query(sql, params);
    return rows;
  }

  async getTransactionConnection(): Promise<ITransactionConnection> {
    const client = await this.pool.connect();
    let closed = false;

    const query = async (
      sql: string,
      params: any[],
    ): Promise<QueryResultRow> => {
      if (closed) throw new Error('Connection is closed');
      try {
        const { rows } = await client.query(sql, params);
        return rows;
      } catch (e) {
        closed = true;
        client.release();
        throw e;
      }
    };

    await query('BEGIN;', []);

    const commit = async () => {
      await query('COMMIT;', []);
      closed = true;
      client.release();
    };

    const rollback = async () => {
      await query('ROLLBACK;', []);
      closed = true;
      client.release();
    };

    return { query, commit, rollback };
  }
}

export = Connection;
