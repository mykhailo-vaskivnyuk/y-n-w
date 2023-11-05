import { IMember, INodeMember } from '../../../domain/types/member.types';
import { TQuery } from '../../types/types';

export interface IQueriesMemberFind {
  unactive: TQuery<[
    ['date', string],
  ], IMember>;
  inTree: TQuery<[
    ['user_node_id', number],
    ['member_node_id', number],
  ], INodeMember>;
  inCircle: TQuery<[
    ['parent_node_id', number],
    ['member_node_id', number],
  ], INodeMember>;
}

export const unactive = `
  SELECT
    nodes.*,
    nodes.net_id::int,
    members.user_id::int,
    members.confirmed
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  WHERE
    members.active_date < $1 AND
    members.confirmed = true
  LIMIT 1
`;

export const inTree = `
  SELECT
    nodes.*,
    members.*,
    members.user_id::int,
    members_invites.*
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_invites ON
    members_invites.node_id = nodes.node_id
  WHERE
    nodes.parent_node_id = $1 AND
    nodes.node_id = $2
`;

export const inCircle = `
  SELECT
    nodes.*,
    members.*,
    members.user_id::int,
    members_invites.*,
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_invites ON
    members_invites.node_id = nodes.node_id
  WHERE
    nodes.node_id = $2 AND (
      nodes.parent_node_id = $1 OR
      nodes.node_id = $1
    )
`;
