import pg from 'pg';
import { IDatabaseConnection } from '../../app/types';

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'merega',
  user: 'merega',
  password: 'merega',
});

const query = (sql: string, params: any[]) =>
  pool.query(sql, params)
    .then((result) => result.rows);

const connect = async () => { await pool.connect() };

export = { query, connect } as IDatabaseConnection;
