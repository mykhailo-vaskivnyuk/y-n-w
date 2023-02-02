import { ITableNets, ITableUsersBoardMessages } from '../../db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetBoard {
  get: TQuery<[
    ['net_node_id', number],
  ], ITableUsersBoardMessages>;
  findUnactive: TQuery<[
    ['date', string],
  ], ITableNets>;
  create: TQuery<[
    ['net_node_id', number],
    ['user_id', number],
    ['node_id', number],
    ['message', string],
  ]>;
  update: TQuery<[
    ['message_id', number],
    ['user_id', number],
    ['message', string],
  ]>;
  remove: TQuery<[
    ['message_id', number],
    ['user_id', number],
  ]>;
  clear: TQuery<[
    ['date', string],
  ]>;
}

export const get = `
  SELECT * FROM users_board_messages
  WHERE net_node_id = $1
  ORDER BY date DESC
`;

export const findUnactive = `
  SELECT net_node_id::int FROM users_board_messages
  WHERE date < $1
  LIMIT 1
`;

export const create = `
  INSERT INTO users_board_messages (
    net_node_id, user_id, node_id, message, date
  )
  VALUES ($1, $2, $3, $4, now() at time zone 'UTC')
`;

export const update = `
  UPDATE users_board_messages
  SET message = $3, date = now() at time zone 'UTC'
  WHERE
    message_id = $1 AND
    user_id = $2
`;

export const remove = `
  DELETE FROM users_board_messages
  WHERE
    message_id = $1 AND
    user_id = $2
`;

export const clear = `
  DELETE FROM users_board_messages
  WHERE date < $1
`;
