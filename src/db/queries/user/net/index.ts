/* eslint-disable max-lines */
import {
  IUserNetDataResponse,
} from '../../../../client/common/api/types/types';
import { DbRecordOrNull } from '../../../../client/common/types';
import {
  ITableNets, ITableNetsData, ITableNetsUsersData,
  ITableNodes, ITableUsersNodesInvites,
} from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNet {
  find: TQuery<[
    ['user_id', number],
    ['net_node_id', number],
  ],
    ITableNets &
    ITableNodes &
    DbRecordOrNull<ITableUsersNodesInvites>>
  read: TQuery<[
    ['user_id', number],
    ['net_node_id', number],
  ],
    ITableNets &
    ITableNetsData &
    ITableNetsUsersData &
    ITableNodes &
    DbRecordOrNull<ITableUsersNodesInvites>
  >;
  getNodes: TQuery<[
    ['user_id', number],
    ['net_node_id', number | null],
  ], ITableNodes>;
  getData: TQuery<[
    ['user_id', number],
    ['net_node_id', number],
  ], IUserNetDataResponse>
}

export const find = `
  SELECT
    nets.net_level,
    nodes.node_id, nodes.parent_node_id,
    users_nodes_invites.token
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_node_id = nets_users_data.net_node_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id 
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nets_users_data.node_id
  WHERE
    nets_users_data.user_id = $1 AND
    nets_users_data.net_node_id = $2
`;

export const read = `
  SELECT *, nets_users_data.user_id
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_node_id = nets_users_data.net_node_id
  INNER JOIN nets_data ON
    nets_data.net_node_id = nets.net_node_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nets_users_data.node_id
  WHERE
    nets_users_data.user_id = $1 AND
    nets_users_data.net_node_id = $2
`;

export const getNodes = `
  SELECT
    nodes.*,
    nodes.count_of_members - 1 AS count_of_members
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_node_id = nets_users_data.net_node_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  WHERE
    nets_users_data.user_id = $1 AND ((
      ($2 + 1) NOTNULL AND 
      nets.first_net_id = $2 AND
      nets.net_level >= (SELECT net_level FROM nets WHERE net_node_id = $2)) OR 
      ($2 + 1) ISNULL
    )
  ORDER BY nets.net_level DESC
`;

export const getData = `
  SELECT
    nodes.node_id,
    nodes.parent_node_id,
    users_nodes_invites.token,
    users_members.vote,
    SUM (
      CASE
        WHEN um.vote = true THEN 1
        ELSE 0
      END
    ) AS vote_count
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_node_id = nets_users_data.net_node_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nets_users_data.node_id
  LEFT JOIN users_members ON
    users_members.user_id = nets_users_data.user_id AND
    users_members.member_id = nets_users_data.user_id
  LEFT JOIN users_members as um ON
    um.member_id = nets_users_data.user_id AND
    um.parent_node_id = nodes.parent_node_id
  WHERE
    nets_users_data.user_id = $1 AND
    nets_users_data.net_node_id = $2
  GROUP BY
    nodes.node_id,
    nodes.parent_node_id,
    users_nodes_invites.token,
    users_members.vote
`;
