import { ITableUsers } from '../db.types';
import { TQuery } from '../types';

export interface IQueriesAuth {
  getUserIfExists: TQuery<[
    ['email', string],
    ['password', string],
  ],
  ITableUsers>
}

export const getUserIfExists = 'SELECT * FROM users WHERE email=$1 AND password=$2';
