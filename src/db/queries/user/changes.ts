import { TQuery } from '../../types/types';

export interface IQueriesUserChanges {
  write: TQuery<[
    ['user_id', number],
    ['date', string],
  ]>;
}

export const write = `
  INSERT INTO users_changes AS uc (
    user_id, date
  )
  VALUES ($1, $2)
  ON CONFLICT (user_id)
  DO
    UPDATE SET date = $2
    WHERE uc.user_id = $1
`;
