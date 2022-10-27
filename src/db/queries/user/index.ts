import { ITableUsers } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesUser {
  getUserById:TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  findUserByEmail: TQuery<[
    ['email', string],
  ], ITableUsers>;
  findByLink: TQuery<[
    ['link', string],
  ], ITableUsers>;
  createUser: TQuery<[
    ['email', string],
    ['password', string],
    ['link', string],
  ]>;
  setLink: TQuery<[
    ['user_id', number],
    ['link', string],
  ]>;
  setRestoreLink: TQuery<[
    ['user_id', number],
    ['restore', string],
  ]>;
  unsetUserLinks: TQuery<[
    ['user_id', number],
  ]>;
  remove: TQuery;
}

export const getUserById = 'SELECT * FROM users WHERE user_id=$1';
export const findUserByEmail = 'SELECT * FROM users WHERE email=$1';
export const findByLink = 'SELECT * FROM users WHERE link=$1 OR restore=$1';
export const createUser = 'INSERT INTO users (email, password, link) VALUES($1, $2, $3)';
export const setLink = 'UPDATE users SET link=$2 WHERE user_id=$1';
export const setRestoreLink = 'UPDATE users SET restore=$2 WHERE user_id=$1';
export const unsetUserLinks = 'UPDATE users SET link=NULL, restore=NULL WHERE user_id=$1';
