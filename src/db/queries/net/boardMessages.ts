import { TQuery } from '../../types/types';
import { ITableBoardMessages } from '../../../domain/types/db.types';
import { IMemberNode } from '../../../domain/types/member.types';

export interface IQueriesNetBoard {
  create: TQuery<
    [['net_id', number], ['member_id', number], ['message', string]]
  >;
  update: TQuery<
    [['message_id', number], ['member_id', number], ['message', string]]
  >;
  remove: TQuery<[['message_id', number], ['member_id', number]]>;
  get: TQuery<[['net_id', number]], ITableBoardMessages>;
  findUnactive: TQuery<
    [['date', string]],
    IMemberNode & { message_id: number }
  >;
  clear: TQuery<[['message_id', number]]>;
}

export const create = `
  INSERT INTO board_messages (
    net_id, member_id, message, date
  )
  VALUES ($1, $2, $3, now() at time zone 'UTC')
`;

export const update = `
  UPDATE board_messages
  SET message = $3, date = now() at time zone 'UTC'
  WHERE
    message_id = $1 AND
    member_id = $2
`;

export const remove = `
  DELETE FROM board_messages
  WHERE
    message_id = $1 AND
    member_id = $2
`;

export const get = `
  SELECT *
  FROM board_messages
  WHERE net_id = $1
  ORDER BY date DESC
`;

export const findUnactive = `
  SELECT
    bm.message_id,
    nodes.*,
    nodes.net_id::int,
    nodes.node_id::int,
    nodes.parent_node_id::int,
  FROM board_messages AS bm
  INNER JOIN nodes ON
    nodes.node_id = bm.member_id
  WHERE date < $1
  LIMIT 1
`;

export const clear = `
  DELETE FROM board_messages
  WHERE message_id = $1
`;
