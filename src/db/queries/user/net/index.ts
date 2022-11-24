import { ITableNets, ITableNetsData, ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNet {
  read: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNets & ITableNetsData>;
  getNodes: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ], ITableNodes>;
}

export const read = `
  SELECT * FROM nets_users_data
  LEFT JOIN nets ON nets_users_data.net_id = nets.net_id
  INNER JOIN nets_data ON nets.net_id = nets_data.net_id
  WHERE nets_users_data.user_id = $1 AND nets.net_id = $2
`;

export const getNodes = `
  SELECT *, nodes.count_of_members - 1 AS count_of_members
  FROM nodes
  LEFT JOIN nets ON nodes.first_node_id = nets.node_id
  WHERE
    user_id = $1 AND (
      ($2 + 1) NOTNULL AND
      nets.net_level >= (SELECT net_level FROM nets WHERE net_id = $2)
    ) OR (
      ($2 + 1) ISNULL AND true
    )
  ORDER BY nets.net_level DESC
`;
