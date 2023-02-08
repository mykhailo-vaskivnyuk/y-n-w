import { ITableNets, ITableNodes } from '../../db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetFind {
  byToken: TQuery<[
    ['token', string],
    ['user_id', number],
  ],
    ITableNets &
    ITableNodes & {
      another_user_exists: number | null;
      user_exists: number | null;
    }
  >;
}

export const byToken = `
  SELECT
    nodes.*,
    nets.parent_net_id,
    this_user.user_id AS user_exists
  FROM nodes_invites
  INNER JOIN nodes ON
    nodes.node_id = nodes_invites.node_id
  INNER JOIN nets ON
    nets.net_id = nodes.net_id
  LEFT JOIN nets_users_data AS another_user ON
    another_user.node_id = nodes.node_id
  LEFT JOIN nets_users_data AS this_user ON
    this_user.net_id = nodes.net_id AND
    this_user.user_id = $2
  WHERE
    nodes_invites.token = $1 AND
    another_user.user_id ISNULL
`;
