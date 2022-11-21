import { ITableUsers, ITableUsersTokens } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesUserNet } from './net';
import { IQueriesUserNode } from './node';

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
  createTokens: TQuery<[
    ['user_id', number],
    ['confirm_token', string],
  ]>;
  setToken: TQuery<[
    ['user_id', number],
    ['confirm_token', string | null],
    ['restore_token', string | null],
  ]>;
  unsetToken: TQuery<[
    ['user_id', number],
  ]>;
  remove: TQuery;
  net:IQueriesUserNet;
  node:IQueriesUserNode;
}

export const getById = `
  SELECT * FROM users
  WHERE user_id=$1;
`;

export const findByEmail = `
  SELECT users.*, users_tokens.confirm_token FROM users
  LEFT JOIN users_tokens ON users.user_id = users_tokens.user_id
  WHERE email=$1
`;

export const findByToken = `
  SELECT * FROM users
  LEFT JOIN users_tokens ON users.user_id = users_tokens.user_id
  WHERE confirm_token=$1 OR restore_token=$1
`;

export const create = `
  INSERT INTO users (email, password)
  VALUES($1, $2)
  RETURNING *
`;

export const createTokens = `
  INSERT INTO users_tokens (user_id, confirm_token)
  VALUES($1, $2)
`;

export const setToken = `
  UPDATE users_tokens SET confirm_token=$2, restore_token=$3
  WHERE user_id=$1
`;

export const unsetToken = `
  UPDATE users_tokens SET confirm_token=NULL, restore_token=NULL
  WHERE user_id=$1
`;
