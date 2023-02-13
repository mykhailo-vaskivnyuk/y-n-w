import { ITableUsers } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';
import { IQueriesUserNet } from './net';
import { IQueriesUserNets } from './nets/get';
import { IQueriesUserToken } from './token';
import { IQueriesUserChanges } from './changes';

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
    ['password', string],
  ], ITableUsers>;
  confirm: TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  remove: TQuery<[
    ['user_id', number],
  ]>;
  copy: TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  net: IQueriesUserNet;
  nets: IQueriesUserNets;
  token: IQueriesUserToken;
  changes: IQueriesUserChanges;
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
    email, password
  )
  VALUES ($1, $2)
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

export const copy = `
  INSERT INTO users (
    email,
    name,
    mobile,
    password,
    confirmed
  )
  SELECT
    ('copy:' || email) as email,
    name,
    mobile,
    password,
    confirmed
  FROM users
  WHERE user_id = $1
  RETURNING *
`;
