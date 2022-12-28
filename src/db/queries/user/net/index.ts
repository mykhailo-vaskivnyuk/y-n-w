import { DbRecordOrNull } from '../../../../client/common/types';
import {
  ITableNets, ITableNetsData, ITableNetsUsersData,
  ITableNodes, ITableUsersNodesInvites,
} from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNet {
  find: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ],
    ITableNets &
    ITableNodes &
    ITableUsersNodesInvites>
  read: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ],
    ITableNets &
    ITableNetsData &
    ITableNetsUsersData &
    ITableNodes &
    DbRecordOrNull<ITableUsersNodesInvites>
  >;
  getNodes: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ], ITableNodes>;
  removeInvites: TQuery<[
    ['net_id', number | null],
    ['user_id', number],
  ]>;
}

export const find = `
  SELECT nets.net_level, nodes.node_id, users_nodes_invites.token
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_id = nets_users_data.net_id
  INNER JOIN nodes ON
    nodes.user_id = nets_users_data.user_id 
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nodes.node_id
  WHERE nets_users_data.user_id = $1 AND nets_users_data.net_id = $2
`;

export const read = `
  SELECT *, nodes.node_id, nodes.user_id
  FROM nets
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id 
  INNER JOIN nets_users_data ON
    nets_users_data.net_id = nets.net_id
  INNER JOIN nodes ON
    nodes.first_node_id = nets.node_id AND
    nodes.user_id = $1
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nodes.node_id
  WHERE nets.net_id = $2
`;

export const getNodes = `
  SELECT nodes.*, nodes.count_of_members - 1 AS count_of_members
  FROM nodes
  LEFT JOIN nets ON nodes.first_node_id = nets.node_id
  WHERE
    nodes.user_id = $1 AND (
      (
        ($2 + 1) NOTNULL AND (
          nets.net_id = $2 OR
          nets.net_level > (SELECT net_level FROM nets WHERE net_id = $2)
        )
      ) OR (
        ($2 + 1) ISNULL AND true
      )
    )
  ORDER BY nets.net_level DESC
`;

export const removeInvites = `
  DELETE FROM users_nodes_invites
  WHERE user_id = $2 AND node_id IN (
    SELECT nodes.node_id
    FROM nodes
    LEFT JOIN nets ON nodes.first_node_id = nets.node_id
    WHERE
      nodes.user_id = $1 AND (
        (
          ($2 + 1) NOTNULL AND (
            nets.net_id = $2 OR
            nets.net_level > (SELECT net_level FROM nets WHERE net_id = $2)
          )
        ) OR (
          ($2 + 1) ISNULL AND true
        )
      )
  )
`;
