import { IMemberResponse } from '../../../client/common/api/types/types';
import { ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNetTree {
  get: TQuery<[
    ['user_id', number],
    ['node_id', number],
  ], IMemberResponse>;
  getNodes: TQuery<[
    ['parent_node_id', number],
  ], ITableNodes>;
}

export const get = `
  SELECT 
    nodes.node_id,
    nodes.count_of_members,
    users.email as name,
    members.confirmed,
    nodes_invites.member_name,
    nodes_invites.token,
    users_members.dislike,
    users_members.vote
  FROM nodes
  LEFT JOIN nets_users_data AS members ON
    members.node_id = nodes.node_id
  LEFT JOIN users_members ON
    users_members.parent_node_id = $2 AND
    users_members.user_id = $1 AND
    users_members.member_id = members.user_id
  LEFT JOIN users
    ON users.user_id = members.user_id
  LEFT JOIN nodes_invites ON
    nodes_invites.node_id = nodes.node_id
  WHERE nodes.parent_node_id = $2
  ORDER BY nodes.node_position
`;

export const getNodes = `
  SELECT *
  FROM nodes
  WHERE nodes.parent_node_id = $1
  ORDER BY nodes.count_of_members DESC
`;
