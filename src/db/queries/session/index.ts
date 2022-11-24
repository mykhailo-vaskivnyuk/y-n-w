import { TQuery } from '../../types';

export interface IQueriesSession {
  read: TQuery<[
    ['key', string]],
    { session_value: string }>;
  create: TQuery<[
    ['key', string],
    ['value', string]]>;
  update: TQuery<[
    ['key', string],
    ['value', string]]>;
  remove: TQuery<[
    ['key', string]]>;
}

export const read = `
  SELECT session_value FROM sessions
  WHERE session_key = $1
`;

export const create = `
  INSERT INTO sessions (
    session_key,
    session_value
  )
  VALUES ($1, $2)
`;

export const update = `
  UPDATE sessions
  SET session_value = $2
  WHERE session_key = $1
`;

export const remove = `
  DELETE FROM sessions
  WHERE session_key = $1
`;
