import { ITableNets, ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNetFind {
  byToken: TQuery<[
    ['token', string],
    ['user_id', number],
  ],
    ITableNets &
    ITableNodes &
    { user_exists: number | null }
  >;
}

export const byToken = `
  SELECT
    nets.net_node_id,
    nets.parent_net_id,
    nodes.*,
    nets_users_data.user_id AS user_exists
  FROM users_nodes_invites
  INNER JOIN nodes ON
    nodes.node_id = users_nodes_invites.node_id
  INNER JOIN nets ON
    nets.net_node_id = nodes.net_node_id
  LEFT JOIN nets_users_data AS error ON
    error.node_id = nodes.node_id
  LEFT JOIN nets_users_data ON
    nets_users_data.net_node_id = nodes.net_node_id
  WHERE
    users_nodes_invites.token = $1 AND
    error.user_id ISNULL
`;
