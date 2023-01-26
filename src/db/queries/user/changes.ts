import { ITableUsersMessages } from '../../db.types';
import { TQuery } from '../../types/types';

export interface IQueriesUserChanges {
  read: TQuery<[
    ['user_id', number],
  ], ITableUsersMessages>;
  write: TQuery<[
    ['user_id', number],
    ['date', string],
  ]>;
  confirm: TQuery<[
    ['user_id', number],
    ['message_id', number],
  ]>;
}

export const read = `
  SELECT *, TRIM(net_view) as net_view
  FROM users_messages
  WHERE user_id = $1
  ORDER BY message_id
`;

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

export const confirm = `
  DELETE FROM users_messages
  WHERE user_id = $1 AND message_id = $2
`;
