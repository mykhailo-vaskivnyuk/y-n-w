import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNode {
  findByNet: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNodes>;
}

export const findByNet = `
  SELECT nodes.* FROM nodes
  INNER JOIN nets ON
    nodes.node_id = nets.node_id OR
    nodes.node_id = nodes.first_node_id
  WHERE user_id = $1 AND net_id = $2
`;
