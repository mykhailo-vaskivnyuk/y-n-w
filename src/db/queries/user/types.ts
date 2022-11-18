import {
  ITableNets, ITableNetsData, ITableUsers, ITableUsersTokens,
} from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesUser {
  getById:TQuery<[
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
  getNets:TQuery<[
    ['user_id', number],
  ], ITableNets & ITableNetsData>;
}
