/* eslint-disable max-lines */
import { IEvent } from '../../../client/common/server/types/types';
import { TQuery } from '../../types/types';

export interface IQueriesEvents {
  read: TQuery<[
    ['user_id', number],
    ['date', string | null],
  ], IEvent>;
  confirm: TQuery<[
    ['user_id', number],
    ['event_id', number],
  ]>;
  removeFromCircle: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ]>;
  removeFromTree: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ]>;
}

export const read = `
  SELECT *, TRIM(net_view) as net_view, TRIM(event_type) as event_type
  FROM events
  WHERE
    user_id = $1 AND (
      $2::timestamp ISNULL OR
      date > $2
    )
  ORDER BY event_id
`;

export const confirm = `
  DELETE FROM events
  WHERE user_id = $1 AND event_id = $2
`;

export const removeFromCircle = `
  DELETE FROM events
  WHERE
    user_id = $1 AND
    net_id = $2 AND
    net_view = 'circle'
`;

export const removeFromTree = `
  DELETE FROM events
  WHERE
    user_id = $1 AND
    net_id = $2 AND
    net_view = 'tree'
`;
