import { ITableUsersNodesInvites } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesMember {
  find: TQuery<[
    ['user_node_id', number],
    ['member_node_id', number],
  ], ITableUsersNodesInvites>;
  inviteCreate: TQuery<[
    ['node_id', number],
    ['user_id', number],
    ['member_name', string],
    ['token', string],
  ]>;
  inviteCancel: TQuery<[
    ['node_id', number],
  ]>;
}

export const find = `
  SELECT users_nodes_invites.node_id
  FROM nodes
  LEFT JOIN users
     ON nodes.user_id = users.user_id
  LEFT JOIN users_nodes_invites
    ON users_nodes_invites.node_id = nodes.node_id
  WHERE nodes.parent_node_id = $1 AND nodes.node_id = $2
`;

export const inviteCreate = `
  INSERT INTO users_nodes_invites (
    node_id,
    user_id,
    member_name,
    token
  )
  VALUES ($1, $2, $3, $4)
`;

export const inviteCancel = `
  DELETE FROM users_nodes_invites
  WHERE node_id = $1
`;
