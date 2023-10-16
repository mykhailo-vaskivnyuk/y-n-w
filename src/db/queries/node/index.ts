/* eslint-disable max-lines */
import { ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';
import { IQueriesNodeTree } from './tree';

export interface IQueriesNode {
  create: TQuery<[
    ['net_id', number],
  ], ITableNodes>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
  updateCountOfMembers: TQuery<[
    ['node_id', number],
    ['addCount', number]
  ], ITableNodes>;
  getIfEmpty: TQuery<[
    ['node_id', number],
  ], ITableNodes>;
  getChild: TQuery<[
    ['parent_node_id', number],
    ['node_position', number]
  ], ITableNodes>;
  move: TQuery<[
    ['node_id', number],
    ['new_node_level', number],
    ['new_parent_node_id', number | null],
    ['new_node_position', number],
    ['new_count_of_members', number],
  ]>;
  changeLevel: TQuery<[
    ['node_id', number],
  ]>;
  changeLevelAll: TQuery<[
    ['net_id', number],
  ]>;
  findFreeByDate: TQuery<[
    ['strDate', string]
  ], ITableNodes>;
  tree: IQueriesNodeTree;
}

export const create = `
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

export const getIfEmpty = `
  SELECT nodes.*
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    nodes.node_id = $1 AND
    members.user_id ISNULL
`;

export const getChild = `
  SELECT nodes.*
  FROM nodes
  WHERE
    parent_node_id = $1 AND
    node_position = $2
`;

export const move = `
  UPDATE nodes
  SET
    node_level = $2,
    parent_node_id = $3,
    node_position = $4,
    count_of_members = $5
  WHERE node_id = $1
`;

export const changeLevel = `
  UPDATE nodes
  SET node_level = node_level - 1
  WHERE node_id = $1
`;

export const changeLevelAll = `
  UPDATE nodes
  SET node_level = node_level - 1
  WHERE net_id = $1
`;

export const findFreeByDate = `
  SELECT
    nodes.*,
    nodes.net_id::int
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    members.user_id ISNULL AND
    nodes.count_of_members > 0 AND
    nodes.updated < $1
`;
