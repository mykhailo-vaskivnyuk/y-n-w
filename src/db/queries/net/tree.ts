import { IMemberResponse } from '../../../client/common/server/types/types';
import { ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';
import { IMember } from '../../types/member.types';

export interface IQueriesNetTree {
  get: TQuery<[
    ['user_id', number],
    ['node_id', number],
  ], IMemberResponse>;
  getNodes: TQuery<[
    ['parent_node_id', number],
  ], ITableNodes>;
  getMembers: TQuery<[
    ['parent_node_id', number],
  ], IMember>;
}

export const get = `
  SELECT 
    nodes.node_id,
    nodes.count_of_members,
    users.user_id,
    users.email as name,
    members.confirmed,
    members_invites.member_name,
    members_invites.token,
    users_members.dislike,
    users_members.vote
  FROM nodes
  LEFT JOIN members AS members ON
    members.node_id = nodes.node_id
  LEFT JOIN users_members ON
    users_members.parent_node_id = $2 AND
    users_members.user_id = $1 AND
    users_members.member_id = members.user_id
  LEFT JOIN users
    ON users.user_id = members.user_id
  LEFT JOIN members_invites ON
    members_invites.member_node_id = nodes.node_id
  WHERE nodes.parent_node_id = $2
  ORDER BY nodes.node_position
`;

export const getNodes = `
  SELECT *
  FROM nodes
  WHERE nodes.parent_node_id = $1
  ORDER BY nodes.count_of_members DESC
`;

export const getMembers = `
  SELECT 
    nodes.*,
    members.user_id::int, 
    members.confirmed
  FROM nodes
  INNER JOIN members ON
    members.node_id = nodes.node_id
  WHERE nodes.parent_node_id = $1
`;
