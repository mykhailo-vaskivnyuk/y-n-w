/* eslint-disable max-lines */
import { ITableMembers, ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesNode {
  createInitial: TQuery<[
    ['net_id', number]
  ], ITableNodes>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
  updateCountOfMembers: TQuery<[
    ['node_id', number],
    ['addCount', number]
  ], ITableNodes>;
  createTree: TQuery<[
    ['node_level', number],
    ['parent_node_id', number],
    ['net_id', number],
  ]>;
  removeTree: TQuery<[
    ['parent_node_id', number],
  ]>;
  get: TQuery<[
    ['node_id', number],
  ],
    ITableNodes &
    Pick<ITableMembers, 'user_id'>
  >;
  change: TQuery<[
    ['node_id', number],
    ['new_parent_node_id', number | null],
    ['node_position', number],
  ]>;
  // changeNetNode: TQuery<[
  //   ['new_net_id', number],
  //   ['cur_net_id', number],
  // ]>;
  find: TQuery<[
    ['date', string],
  ], ITableNodes>;
}

export const createInitial = `
  INSERT INTO nodes (
    net_id, count_of_members
  )
  VALUES ($1, 1)
  RETURNING *
`;

export const remove = `
  DELETE FROM nodes
  WHERE node_id = $1
`;

export const updateCountOfMembers = `
  UPDATE nodes
  SET
    count_of_members = count_of_members + $2,
    updated = now() at time zone 'UTC'
  WHERE node_id = $1
  RETURNING *
`;

export const createTree = `
  INSERT INTO nodes (
    node_position, node_level, parent_node_id, net_id
  )
  VALUES
    (1, $1, $2, $3),
    (2, $1, $2, $3),
    (3, $1, $2, $3),
    (4, $1, $2, $3),
    (5, $1, $2, $3),
    (6, $1, $2, $3)
`;

export const removeTree = `
  DELETE FROM nodes
  WHERE parent_node_id = $1
`;

export const get = `
  SELECT nodes.*, members.user_id
  FROM nodes
  LEFT JOIN members ON
    members.node_id = nodes.node_id
  WHERE nodes.node_id = $1
`;

export const change = `
  UPDATE nodes
  SET
    parent_node_id = $2,
    node_position = $3
  WHERE node_id = $1
`;

// export const changeNetNode = `
//   UPDATE nodes
//   SET
//     net_id = $1,
//     node_level = node_level - 1
//   WHERE net_id = $2
// `;

export const find = `
  SELECT nodes.* FROM nodes
  LEFT JOIN members ON
    members.node_id = nodes.node_id
  WHERE
    user_id ISNULL AND
    count_of_members > 0 AND
    updated < $1
`;
