import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNode {
  findByNet: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNodes>;
}

const findByNet = `
  SELECT nodes.* FROM nodes
  INNER JOIN nets ON
    nets.node_id = nodes.first_node_id
  WHERE nodes.user_id = $1 AND nets.net_id = $2
`;

export default findByNet;
