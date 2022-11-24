import { ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNode {
  createInitial: TQuery<[
    ['node_date', string],
    ['user_id', number],
  ], ITableNodes>;
  setFirstNodeId: TQuery<[
    ['node_id', number],
  ], ITableNodes>;
  create: TQuery<[
    ['node_level', number],
    ['node_position', number],
    ['parent_node_id', number],
    ['first_node_id', number],
    ['node_date', string],
  ]>;
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
    ['first_node_id', number],
    ['node_date', string],
  ]>;
  removeTree: TQuery<[
    ['parent_node_id', number],
  ]>;
}

export const createInitial = `
  INSERT INTO nodes (
    count_of_members,
    node_date, user_id
  )
  VALUES (1, $1, $2)
  RETURNING *
`;

export const setFirstNodeId = `
  UPDATE nodes
  SET first_node_id = $1
  WHERE node_id = $1
  RETURNING *
`;

export const create = `
  INSERT INTO nodes (
    node_level,
    node_position,
    parent_node_id,
    first_node_id,
    node_date,
    user_id
  )
  VALUES ($1, $2, $3, $4, $5, NULL)
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
    node_level,
    node_position,
    parent_node_id,
    first_node_id,
    node_date,
    user_id
  )
  VALUES
    ($1, 1, $2, $3, $4, NULL),
    ($1, 2, $2, $3, $4, NULL),
    ($1, 3, $2, $3, $4, NULL),
    ($1, 4, $2, $3, $4, NULL),
    ($1, 5, $2, $3, $4, NULL),
    ($1, 6, $2, $3, $4, NULL)
`;

export const removeTree = `
  DELETE FROM nodes
  WHERE parent_node_id = $1
`;
