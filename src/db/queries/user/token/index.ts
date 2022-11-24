import { TQuery } from '../../../types';

export interface IQueriesUserToken {
  create: TQuery<[
    ['user_id', number],
    ['confirm_token', string | null], // ['confirm_token', string],
  ]>;
  set: TQuery<[
    ['user_id', number],
    ['confirm_token', string | null],
    ['restore_token', string | null],
  ]>;
  unset: TQuery<[
    ['user_id', number],
  ]>;
}

export const create = `
  INSERT INTO users_tokens (user_id, confirm_token)
  VALUES($1, $2)
`;

export const set = `
  UPDATE users_tokens
  SET confirm_token=$2, restore_token=$3
  WHERE user_id=$1
`;

export const unset = `
  UPDATE users_tokens
  SET confirm_token=NULL, restore_token=NULL
  WHERE user_id=$1
`;
