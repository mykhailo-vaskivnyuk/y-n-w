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
    ['link', string | null],
    ['restore', string | null],
  ]>;
  setRestoreLink: TQuery<[
    ['user_id', number],
    ['restore', string],
  ]>;
  unsetLink: TQuery<[
    ['user_id', number],
  ]>;
  remove: TQuery;
}
