import { TQuery } from '../../../types';

export interface IQueriesUserToken {
  create: TQuery<[
    ['user_id', number],
    ['confirm_token', string | null],
    ['restore_token', string | null],
  ]>;
  remove: TQuery<[
    ['user_id', number],
  ]>;
}

export const create = `
  INSERT INTO users_tokens (user_id, confirm_token, restore_token)
  VALUES($1, $2, $3)
`;

export const remove = `
  DELETE FROM users_tokens
  WHERE user_id = $1
`;
