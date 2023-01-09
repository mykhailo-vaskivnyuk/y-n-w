import { ITableUsers } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesUserNet } from './net';
import { IQueriesUserNets } from './nets/get';
import { IQueriesUserToken } from './token';

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
  net: IQueriesUserNet;
  nets: IQueriesUserNets;
  token: IQueriesUserToken;
}

export const getById = `
  SELECT * FROM users
  WHERE user_id = $1;
`;

export const findByEmail = `
  SELECT users.*
  FROM users
  LEFT JOIN users_tokens ON
    users.user_id = users_tokens.user_id
  WHERE email = $1
`;

export const findByToken = `
  SELECT * FROM users
  JOIN users_tokens ON
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
