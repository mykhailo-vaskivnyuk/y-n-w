import { ITableNets, ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNetFind {
  byToken: TQuery<[
    ['token', string],
    ['user_id', number],
  ], ITableNets & ITableNodes & { user_exists: number | null }>;
}

export const byToken = `
  SELECT
    nets.net_id,
    nets.parent_net_id,
    nodes.*,
    nets_users_data.user_id AS user_exists
  FROM nodes
  JOIN users_nodes_invites ON
    nodes.node_id = users_nodes_invites.node_id
  JOIN nets ON
    nets.node_id = nodes.first_node_id
  LEFT JOIN nets_users_data ON
    nets_users_data.net_id = nets.net_id AND nets_users_data.user_id = $2
  WHERE
    nodes.user_id ISNULL AND
    users_nodes_invites.token = $1
`;
