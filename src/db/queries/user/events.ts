import { TQuery } from '../../types/types';

export interface IQueriesUserEvents {
  write: TQuery<[
    ['user_id', number],
    ['notification_date', string],
  ]>;
  clear: TQuery<[
    ['user_id', number],
  ]>;
}

export const write = `
  INSERT INTO users_events AS ue (
    user_id, notification_date
  )
  VALUES ($1, $2)
  ON CONFLICT (user_id)
    DO UPDATE
    SET notification_date = $2
    WHERE ue.user_id = $1
`;

export const clear = `
  DELETE from users_events
  WHERE user_id = $1
`;
