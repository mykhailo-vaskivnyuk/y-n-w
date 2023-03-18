import { TQuery } from '../../types/types';

export interface IQueriesUserEvents {
  write: TQuery<[
    ['user_id', number],
    ['last_event_date', string],
  ]>;
}

export const write = `
  INSERT INTO users_events AS ue (
    user_id, last_event_date
  )
  VALUES ($1, $2)
  ON CONFLICT (user_id)
    DO UPDATE
    SET last_event_date = $2
    WHERE ue.user_id = $1
`;
