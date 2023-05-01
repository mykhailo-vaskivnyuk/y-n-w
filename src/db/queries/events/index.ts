import {
  IEvent, NetEventKeys, NetViewKeys,
} from '../../../client/common/server/types/types';
import { TQuery } from '../../types/types';

export interface IQueriesEvents {
  create: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
    ['net_view', NetViewKeys | null],
    ['from_node_id', number | null],
    ['event_type', NetEventKeys],
    ['message', string],
    ['date', string],
  ]>;
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
  removeFromNet: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ]>;
}

export const create = `
  INSERT INTO events (
    user_id,
    net_id,
    net_view,
    from_node_id,
    event_type,
    message,
    date
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
`;

export const read = `
  SELECT *,
    TRIM(net_view) as net_view,
    TRIM(event_type) as event_type
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
  WHERE
    user_id = $1 AND
    event_id = $2
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

export const removeFromNet = `
  DELETE FROM events
  WHERE
    user_id = $1 AND (
      $2::int ISNULL OR
      net_id = $2
    )
`;
