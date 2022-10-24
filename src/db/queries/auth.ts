import { ITableUsers } from '../db.types';
import { TQuery } from '../types';

export interface IQueriesAuth {
  getUserIfExists: TQuery<[
    ['email', string],
    ['password', string],
  ], ITableUsers>;
  
  createUserIfNotExists: TQuery<[
    ['email', string],
    ['link', string],
  ]>;
  
  getUserByEmail: TQuery<[
    ['email', string],
  ], ITableUsers>;
  
  unsetUserLink: TQuery<[
    ['link', string],
  ]>;
  
  deleteAccount: TQuery<[
    ['user_id', number],
  ]>;

  setUserRestoreLink: TQuery<[
    ['user_id', number],
    ['restore', string],
  ]>;

  unsetUserRestoreLink: TQuery<[
    ['restore', string],
  ]>;

  getUserByLink: TQuery<[
    ['link', string],
  ]>;

  getUserByRestoreLink: TQuery<[
    ['restore', string],
  ]>;
}

export const getUserIfExists = 'SELECT * FROM users WHERE email=$1 AND password=$2';
export const createUserIfNotExists = 'INSERT INTO users (email, link) VALUES($1, $2)';
export const getUserByEmail = 'SELECT * FROM users WHERE email=$1';
export const unsetUserLink = 'UPDATE users SET link=NULL WHERE link=$1';
export const deleteAccount = 'DELETE FROM users WHERE user_id=$1';
export const setUserRestoreLink = 'UPDATE users SET restore=$2 WHERE user_id=$1';
export const unsetUserRestoreLink = 'UPDATE users SET restore=NULL WHERE restore=$1';
export const getUserByLink = 'SELECT * FROM users WHERE link=$1';
export const getUserByRestoreLink = 'SELECT * FROM users WHERE restore=$1';