/* eslint-disable max-lines */
import { ITableUsers } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';
import { IQueriesUserNet } from './net';
import { IQueriesUserNets } from './nets/get';
import { IQueriesUserToken } from './token';
import { IQueriesUserEvents } from './events';

export interface IQueriesUser {
  getById: TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  findByEmail: TQuery<[
    ['email', string],
  ], ITableUsers>;
  findByToken: TQuery<[
    ['token', string],
  ], ITableUsers>;
  create: TQuery<[
    ['email', string],
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
  net: IQueriesUserNet;
  nets: IQueriesUserNets;
  token: IQueriesUserToken;
  events: IQueriesUserEvents;
}

export const getById = `
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

export const create = `
  INSERT INTO users (
    email
  )
  VALUES ($1)
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
  SET name = $2, mobile = $3, password = $4
  WHERE user_id = $1
  RETURNING *
`;
