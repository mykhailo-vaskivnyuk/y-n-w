/* eslint-disable max-lines */
import { IMemberResponse } from '../../../client/common/server/types/types';
import { ITableNodes } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';
import { IMember } from '../../../domain/types/member.types';

export interface IQueriesNetTree {
  getData: TQuery<[['parent_node_id', number]], IMemberResponse>;
  getNodes: TQuery<[['parent_node_id', number]], ITableNodes>;
  getMembers: TQuery<[['parent_node_id', number]], IMember>;
}

export const getData = `
  SELECT 
    nodes.node_id,
    nodes.count_of_members,
    members.user_id,
    members.confirmed,
    users.name,
    members_invites.member_name,
    members_invites.token,
    members_to_members.dislike,
    members_to_members.vote,
    0 AS vote_count
  FROM nodes
  LEFT JOIN members AS members ON
    members.member_id = nodes.node_id
  LEFT JOIN users ON
    users.user_id = members.user_id
  LEFT JOIN members_invites ON
    members_invites.node_id = nodes.node_id
  LEFT JOIN members_to_members ON
    members_to_members.to_member_id = members.member_id AND
    members_to_members.from_member_id = $1
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
    nodes.net_id::int,
    members.user_id::int, 
    members.confirmed
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id
  WHERE nodes.parent_node_id = $1
`;
