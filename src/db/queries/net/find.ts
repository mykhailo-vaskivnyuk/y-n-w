import { ITableNets, ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetFind {
  byToken: TQuery<[
    ['token', string],
    ['user_id', number],
  ],
    Pick<ITableNets, 'parent_net_id'> &
    ITableNodes & {
      // another_user_exists: number | null;
      user_exists: number | null;
    }
  >;
}

export const byToken = `
  SELECT
    nodes.*,
    nets.parent_net_id,
    this_user.user_id AS user_exists
  FROM members_invites
  INNER JOIN nodes ON
    nodes.node_id = members_invites.node_id
  INNER JOIN nets ON
    nets.node_id = nodes.root_node_id
  LEFT JOIN members AS another_user ON
    another_user.member_id = nodes.node_id
  LEFT JOIN members AS this_user ON
    this_user.user_id = $2
  LEFT JOIN nodes AS ns ON
    ns.node_id = this_user.member_id AND
    ns.root_node_id = nodes.root_node_id
  WHERE
    members_invites.token = $1 AND
    another_user.user_id ISNULL
`;
