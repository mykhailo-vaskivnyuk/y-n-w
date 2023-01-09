/* eslint-disable max-lines */
import { ITableNetsUsersData, ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNode {
  createInitial: TQuery<[
  ], ITableNodes>;
  setNetNodeId: TQuery<[
    ['net_node_id', number],
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
    ['net_node_id', number],
  ]>;
  removeTree: TQuery<[
    ['parent_node_id', number],
  ]>;
  get: TQuery<[
    ['node_id', number],
  ],
    ITableNodes &
    Pick<ITableNetsUsersData, 'user_id' | 'confirmed'>
  >;
  change: TQuery<[
    ['node_id', number],
    ['parent_node_id', number | null],
  ]>;
}

export const createInitial = `
  INSERT INTO nodes (
    count_of_members
  )
  VALUES (1)
  RETURNING *
`;

export const setNetNodeId = `
  UPDATE nodes
  SET net_node_id = $1
  WHERE node_id = $1
  RETURNING *
`;

export const remove = `
  DELETE FROM nodes
  WHERE node_id = $1
`;

export const updateCountOfMembers = `
  UPDATE nodes
  SET count_of_members = count_of_members + $2
  WHERE node_id = $1
  RETURNING *
`;

export const createTree = `
  INSERT INTO nodes (
    node_position, node_level, parent_node_id, net_node_id
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
  SELECT nodes.*, nets_users_data.user_id
  FROM nodes
  LEFT JOIN nets_users_data ON
    nets_users_data.node_id = nodes.node_id
  WHERE nodes.node_id = $1
`;

export const change = `
  UPDATE nodes
  SET parent_node_id = $2
  WHERE node_id = $1
`;
