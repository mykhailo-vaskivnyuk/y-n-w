import { ITableUsers } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesUser {
  getById:TQuery<[
    ['user_id', number],
  ], ITableUsers>;
  findByEmail: TQuery<[
    ['email', string],
  ], ITableUsers>;
  findByLink: TQuery<[
    ['link', string],
  ], ITableUsers>;
  create: TQuery<[
    ['email', string],
    ['password', string],
    ['link', string],
  ], ITableUsers>;
  setLink: TQuery<[
    ['user_id', number],
    ['link', string | null],
    ['restore', string | null],
  ]>;
  unsetLink: TQuery<[
    ['user_id', number],
  ]>;
  remove: TQuery;
}
