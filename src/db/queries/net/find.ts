import {
  INetResponse, OmitNull,
} from '../../../client/common/server/types/types';
import { ITableNets, ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetFind {
  byToken: TQuery<[
    ['token', string]
  ],
    ITableNodes &
    Pick<ITableNets, 'parent_net_id'>
  >;
  byUser: TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], OmitNull<INetResponse>>;
}

export const byToken = `
  SELECT
    nodes.*,
    nets.parent_net_id
  FROM members_invites
  INNER JOIN nodes ON
    nodes.node_id = members_invites.node_id
  INNER JOIN nets ON
    nets.net_id = nodes.net_id
  WHERE
    members_invites.token = $1
`;

export const byUser = `
  SELECT
    nets.net_id,
    nets.net_level,
    nets.parent_net_id,
    nets_data.name,
    nets_data.goal,
    nodes.node_id,
    nodes.parent_node_id,
    root_node.count_of_members AS total_count_of_members
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  INNER JOIN nets ON
    nets.net_id = nodes.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id
  INNER JOIN nodes AS root_node ON
    root_node.node_id = nets.net_id AND
    root_node.parent_node_id ISNULL
  WHERE
    nets.net_id = $1 AND
    members.user_id = $2
`;
