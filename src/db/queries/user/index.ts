import { ITableUsers, ITableUsersTokens } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesUserMembers } from './members';
import { IQueriesUserNet } from './net';
import { IQueriesUserNets } from './nets/get';
import { IQueriesUserToken } from './token';

export interface IQueriesUser {
  getById: TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  findByEmail: TQuery<[
    ['email', string],
  ], ITableUsers & ITableUsersTokens>;
  findByToken: TQuery<[
    ['confirm_token', string],
  ], ITableUsers>;
  create: TQuery<[
    ['email', string],
    ['password', string],
  ], ITableUsers>;
  remove: TQuery<[
    ['user_id', number],
  ]>;
  net: IQueriesUserNet;
  nets: IQueriesUserNets;
  token: IQueriesUserToken;
  members: IQueriesUserMembers;
}

export const getById = `
  SELECT * FROM users
  WHERE user_id=$1;
`;

export const findByEmail = `
  SELECT users.*, users_tokens.confirm_token
  FROM users
  LEFT JOIN users_tokens ON users.user_id = users_tokens.user_id
  WHERE email=$1
`;

export const findByToken = `
  SELECT * FROM users
  JOIN users_tokens ON users.user_id = users_tokens.user_id
  WHERE confirm_token=$1 OR restore_token=$1
`;

export const create = `
  INSERT INTO users (email, password)
  VALUES($1, $2)
  RETURNING *
`;

export const remove = `
  DELETE FROM users
  WHERE user_id = $1
`;
