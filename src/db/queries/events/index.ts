/* eslint-disable max-lines */
import {
  IEvent,
  NetEventKeys,
  NetViewKeys,
} from '../../../client/common/server/types/types';
import { TQuery } from '../../types/types';

export interface IQueriesEvents {
  create: TQuery<
    [
      ['user_id', number],
      ['net_id', number | null],
      ['net_view', NetViewKeys | null],
      ['from_node_id', number | null],
      ['event_type', NetEventKeys],
      ['message', string],
    ]
  >;
  readAll: TQuery<[], IEvent>;
  read: TQuery<[['user_id', number], ['event_id', number]], IEvent>;
  confirm: TQuery<[['user_id', number], ['event_id', number]]>;
  removeFromNet: TQuery<[['user_id', number], ['net_id', number | null]]>;
}

export const create = `
  INSERT INTO events (
    user_id,
    net_id,
    net_view,
    from_node_id,
    event_type,
    message
  )
  VALUES ($1, $2, $3, $4, $5, $6)
`;

export const read = `
  SELECT
    *,
    TRIM(net_view) as net_view,
    TRIM(event_type) as event_type
  FROM events
  WHERE
    user_id = $1 AND
    event_id > $2
  ORDER BY event_id
`;

export const readAll = `
  SELECT
    *,
    TRIM(net_view) as net_view,
    TRIM(event_type) as event_type
  FROM events
  ORDER BY event_id
`;

export const confirm = `
  DELETE FROM events
  WHERE
    user_id = $1 AND
    event_id = $2
`;

export const removeFromNet = `
  DELETE FROM events
  WHERE
    user_id = $1 AND
    (
      $2::int ISNULL OR
      net_id = $2
    )
`;
