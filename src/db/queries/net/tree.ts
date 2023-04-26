import { IMemberResponse } from '../../../client/common/server/types/types';
import { ITableNodes } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';
import { IMember } from '../../types/member.types';

export interface IQueriesNetTree {
  get: TQuery<[
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
    members_to_members.dislike,
    members_to_members.vote
  FROM nodes
  LEFT JOIN members AS members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_to_members ON
    members_to_members.from_member_id = $1
  LEFT JOIN nodes AS ns ON
    ns.node_id = members_to_members.to_member_id AND
    ns.parent_node_id = $1
  LEFT JOIN users
    ON users.user_id = members.user_id
  LEFT JOIN members_invites ON
    members_invites.node_id = nodes.node_id
  WHERE nodes.parent_node_id = $1
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
    nets.net_id::int,
    members.user_id::int, 
    members.confirmed
  FROM nodes
  INNER JOIN nets ON
    nets.node_id = nodes.root_node_id
  INNER JOIN members ON
    members.member_id = nodes.node_id
  WHERE nodes.parent_node_id = $1
`;
