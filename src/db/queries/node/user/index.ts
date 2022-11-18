import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNodeUser {
  remove:TQuery<[
    ['node_id', number],
  ], ITableNodes>;
  findByNet: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNodes>;
}

export const remove = `
  UPDATE nodes
  SET user_id = NULL, count_of_members = count_of_members - 1
  WHERE node_id = $1
  RETURNING *
`;

export const findByNet = `
    SELECT nodes.* FROM nodes
    INNER JOIN nets ON
      nodes.node_id = nets.node_id OR
      nodes.node_id = nodes.first_node_id
    WHERE user_id = $1 AND net_id = $2
`;
