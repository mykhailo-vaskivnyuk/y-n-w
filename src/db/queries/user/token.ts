import { TQuery } from '../../types/types';

export interface IQueriesUserToken {
  create: TQuery<[['user_id', number], ['token', string]]>;
  remove: TQuery<[['user_id', number]]>;
}

export const create = `
  INSERT INTO users_tokens (user_id, token)
  VALUES ($1, $2)
  ON CONFLICT (user_id)
    DO UPDATE
    SET token = EXCLUDED.token
    WHERE users_tokens.user_id = $1 
`;

export const remove = `
  DELETE FROM users_tokens
  WHERE user_id = $1
`;
