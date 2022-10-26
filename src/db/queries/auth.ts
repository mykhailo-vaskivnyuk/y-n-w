import { ITableUsers } from '../db.types';
import { TQuery } from '../types';

export interface IQueriesAuth {
  getUserIfExists: TQuery<[
    ['email', string],
    ['password', string],
  ], ITableUsers>;
  
  deleteAccount: TQuery<[
    ['user_id', number],
  ]>;

  // unsetUserRestoreLink: TQuery<[
  //   ['restore', string],
  // ]>;

  // getUserByRestoreLink: TQuery<[
  //   ['restore', string],
  // ]>;
}

export const getUserIfExists = 'SELECT * FROM users WHERE email=$1 AND password=$2';
export const deleteAccount = 'DELETE FROM users WHERE user_id=$1';
export const setUserRestoreLink = 'UPDATE users SET restore=$2 WHERE user_id=$1';
// export const unsetUserRestoreLink = 'UPDATE users SET restore=NULL WHERE restore=$1';
// export const getUserByRestoreLink = 'SELECT * FROM users WHERE restore=$1';