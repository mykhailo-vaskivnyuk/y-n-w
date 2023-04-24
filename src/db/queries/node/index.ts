/* eslint-disable max-lines */
import { ITableMembers, ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesNode {
  createInitial: TQuery<[], ITableNodes>;
  setRootNode: TQuery<[
    ['root_node_id', number],
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
    ['root_node_id', number],
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
  getByParent: TQuery<[
    ['parent_node_id', number],
    ['node_position', number]
  ], ITableNodes>;
  find: TQuery<[
    ['date', string],
  ], ITableNodes>;
  move: TQuery<[
    ['node_id', number],
    ['new_node_level', number],
    ['new_parent_node_id', number | null],
    ['new_node_position', number],
    ['new_count_of_members', number],
  ]>;
  changeTree: TQuery<[
    ['parent_node_id', number],
    ['new_node_id', number],
  ]>;
  changeLevel: TQuery<[
    ['node_id', number],
  ]>;
  changeRootNode: TQuery<[
    ['root_node_id', number],
    ['new_root_node_id', number],
  ]>;
}

export const createInitial = `
  INSERT INTO nodes (
    count_of_members
  )
  VALUES (1)
  RETURNING *
`;

export const setRootNode = `
  UPDATE nodes
  SET root_node_id = $1
  WHERE node_id = $1
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
    node_level, parent_node_id, root_node_id, node_position
  )
  VALUES
    ($1, $2, $3, 0),
    ($1, $2, $3, 1),
    ($1, $2, $3, 2),
    ($1, $2, $3, 3),
    ($1, $2, $3, 4),
    ($1, $2, $3, 5)
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

export const getByParent = `
    SELECT nodes.*
    FROM nodes
    WHERE parent_node_id = $1 AND node_position = $2
`;

export const find = `
  SELECT nodes.* FROM nodes
  LEFT JOIN members ON
    members.node_id = nodes.node_id
  WHERE
    user_id ISNULL AND
    count_of_members > 0 AND
    updated < $1
`;

export const move = `
  UPDATE nodes
  SET
    node_level = $2
    parent_node_id = $3
    node_position = $4
    count_of_members = $5
  WHERE node_id = $1
`;

export const changeTree = `
  UPDATE nodes
  SET parent_node_id =
    CASE WHEN parent_node_id = $1
      THEN $2
      ELSE $1
    END
  WHERE parent_node_id IN ($1, $2) AND NOT node_id IN ($1, $2)
`;

export const changeLevel = `
  UPDATE nodes
  SET node_level = node_level - 1
  WHERE node_id = $1
`;

export const changeNet = `
  UPDATE nodes
  SET 
    root_node_id = $2,
    node_level = node_level - 1
  WHERE root_node_id = $1
`;
