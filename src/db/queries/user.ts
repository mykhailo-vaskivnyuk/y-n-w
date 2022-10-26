import { ITableUsers } from '../db.types';
import { TQuery } from '../types';

export interface IQueriesUser {
  getUserById:TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  findUserByEmail: TQuery<[
    ['email', string],
  ], ITableUsers>;
  createUser: TQuery<[
    ['email', string],
    ['password', string],
    ['link', string],
  ]>;
}

export const getUserById = 'SELECT * FROM users WHERE user_id=$1';
export const findUserByEmail = 'SELECT * FROM users WHERE email=$1';
export const createUser = 'INSERT INTO users (email, password, link) VALUES($1, $2, $3)';
