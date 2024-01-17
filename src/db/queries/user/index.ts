/* eslint-disable max-lines */
import { ITableUsers } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';
import { IQueriesUserNetData } from './netData';
import { IQueriesUserNets } from './nets';
import { IQueriesUserToken } from './token';
import { IQueriesUserEvents } from './events';
import { IQueriesUserMessenger } from './messenger';

export interface IQueriesUser {
  get: TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  findByEmail: TQuery<[
    ['email', string],
  ], ITableUsers>;
  findByToken: TQuery<[
    ['token', string],
  ], ITableUsers>;
  findByChatId: TQuery<[
    ['chatId', string],
  ], ITableUsers>;
  create: TQuery<[
    ['email', string],
  ], ITableUsers>;
  createByChatId: TQuery<[
    ['chat_id', string],
  ], ITableUsers>;
  confirm: TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  remove: TQuery<[
    ['user_id', number],
  ]>;
  update: TQuery<[
    ['user_id', number],
    ['name', string | null],
    ['mobile', string | null],
    ['password', string | null],
  ], ITableUsers>;
  netData: IQueriesUserNetData;
  nets: IQueriesUserNets;
  token: IQueriesUserToken;
  events: IQueriesUserEvents;
  messenger: IQueriesUserMessenger;
}

export const get = `
  SELECT * FROM users
  WHERE user_id = $1;
`;

export const findByEmail = `
  SELECT *, user_id::int
  FROM users
  WHERE email = $1
`;

export const findByToken = `
  SELECT *, users.user_id::int
  FROM users
  INNER JOIN users_tokens ON
    users.user_id = users_tokens.user_id
  WHERE token = $1
`;

export const findByChatId = `
  SELECT *, users.user_id::int
  FROM users
  WHERE chat_id = $1
`;

export const create = `
  INSERT INTO users (
    email
  )
  VALUES ($1)
  RETURNING *, user_id::int
`;

export const createByChatId = `
  INSERT INTO users (
    chat_id, confirmed
  )
  VALUES ($1, true)
  RETURNING *
`;

export const confirm = `
  UPDATE users
  SET confirmed = true
  WHERE user_id = $1
`;

export const remove = `
  DELETE FROM users
  WHERE user_id = $1
`;

export const update = `
  UPDATE users
  SET
    name = $2,
    mobile = $3,
    password = $4
  WHERE user_id = $1
  RETURNING *
`;
