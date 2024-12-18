import { ITableNodes } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNodeTree {
  create: TQuery<
    [['node_level', number], ['parent_node_id', number], ['net_id', number]]
  >;
  remove: TQuery<[['parent_node_id', number]], Pick<ITableNodes, 'node_id'>>;
}

export const create = `
  INSERT INTO nodes (
    node_level, parent_node_id, net_id, node_position
  )
  VALUES
    ($1, $2, $3, 0),
    ($1, $2, $3, 1),
    ($1, $2, $3, 2),
    ($1, $2, $3, 3),
    ($1, $2, $3, 4),
    ($1, $2, $3, 5)
`;

export const remove = `
  DELETE FROM nodes
  WHERE parent_node_id = $1
  RETURNING node_id::int
`;
