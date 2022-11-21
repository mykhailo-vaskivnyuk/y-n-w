import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNodesUser {
  remove: TQuery<[
    ['user_id', number],
    ['net_id_to_leave', number | null],
  ], ITableNodes>;
}

export const remove = `
  UPDATE nodes
  INNER JOIN nets ON nodes.node_id = nets.node_id
  INNER JOIN nets AS net_to_leave
    ON 
      (
        $2 ISNOTNULL AND
        nets.first_node_id = net_to_leave.first_net_id AND
        nets.net_level <= net_to_leave.net_level
      ) OR (
        $2 ISNULL AND
        nets.node_id = net_to_leave.net_id
      )
  SET user_id = NULL, count_of_members = count_of_members - 1
  WHERE user_id = $1
  RETURNING nodes.* ORDER BY DESC nets.net_level
`;
