import { ITableUsers } from '../db.types';
import { TQuery } from '../types';

export interface IQueriesAuth {
  getUserIfExists: TQuery<[
    ['email', string],
    ['password', string],
  ],
  ITableUsers>;
  createUserIfNotExists: TQuery<[
    ['email', string],
    ['link', string],
  ]>;
  getUserByEmail: TQuery<[
    ['email', string],
  ],
  ITableUsers>;
  updateUserLink: TQuery<[
    ['link', string],
  ]>;
  deleteAccount: TQuery<[
    ['user_id', number],
  ]>;
}

export const getUserIfExists = 'SELECT * FROM users WHERE email=$1 AND password=$2';
export const createUserIfNotExists = 'INSERT INTO users (email, link) VALUES($1, $2)';
export const getUserByEmail = 'SELECT * FROM users WHERE email=$1';
export const updateUserLink = 'UPDATE users SET link=NULL WHERE link=$1';
export const deleteAccount = 'DELETE FROM users WHERE user_id=$1';
