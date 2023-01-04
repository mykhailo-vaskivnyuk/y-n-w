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
    users.email as name,
    users_nodes_invites.member_name,
    users_nodes_invites.token,
    users_members.dislike,
    users_members.vote
  FROM nodes
  LEFT JOIN users_members ON
    users_members.parent_node_id = $2 AND
    users_members.user_id = $1 AND
    users_members.member_id = nodes.user_id
  LEFT JOIN users
    ON nodes.user_id = users.user_id
  LEFT JOIN users_nodes_invites
    ON users_nodes_invites.node_id = nodes.node_id
  WHERE 
    nodes.parent_node_id = $2
  ORDER BY nodes.node_position
`;

export const getNodes = `
  SELECT 
    nodes.*
  FROM nodes
  WHERE nodes.parent_node_id = $1
  ORDER BY nodes.node_position
`;
