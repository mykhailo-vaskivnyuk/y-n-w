import { ITableSessions } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesSession {
  read: TQuery<[['key', string]], ITableSessions>;
  create: TQuery<[['user_id', number], ['key', string], ['value', string]]>;
  update: TQuery<[['key', string], ['value', string]]>;
  remove: TQuery<[['key', string]]>;
}

export const read = `
  SELECT *
  FROM sessions
  WHERE session_key = $1
`;

export const create = `
  INSERT INTO sessions (
    user_id, session_key, session_value
  )
  VALUES ($1, $2, $3)
`;

export const update = `
  UPDATE sessions
  SET session_value = $2, updated = now() at time zone 'UTC'
  WHERE session_key = $1
`;

export const remove = `
  DELETE FROM sessions
  WHERE session_key = $1
`;
