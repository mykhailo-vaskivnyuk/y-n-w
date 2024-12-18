/* eslint-disable max-lines */
import { TQuery } from '../../types/types';
// eslint-disable-next-line max-len
import { IUserNetDataResponse } from '../../../client/common/server/types/types';
import { IMember } from '../../../domain/types/member.types';
import { userInSubnets } from '../../utils';

export interface IQueriesUserNetData {
  findByNode: TQuery<[['user_id', number], ['node_id', number]], IMember>;
  getFurthestSubnet: TQuery<
    [['user_id', number], ['net_id', number | null]],
    IMember
  >;
  get: TQuery<[['user_id', number], ['net_id', number]], IUserNetDataResponse>;
}

export const findByNode = `
  SELECT
    nodes.*,
    nodes.node_id::int,
    nodes.parent_node_id::int,
    nodes.net_id::int,
    members.*,
    members.user_id::int
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  WHERE
    members.user_id = $1 AND
    members.member_id = $2
`;

export const getFurthestSubnet = `
  SELECT
    nodes.*,
    nodes.node_id::int,
    nodes.parent_node_id::int,
    nodes.net_id::int,
    members.*,
    members.user_id::int
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  INNER JOIN nets ON
    nets.net_id = nodes.net_id
  WHERE ${userInSubnets()}
  ORDER BY nets.net_level DESC
  LIMIT 1
`;

export const get = `
  SELECT
    nodes.node_id,
    nodes.parent_node_id,
    nodes.count_of_members,
    members.confirmed,
    members_to_members.vote,
    SUM (
      CASE
        WHEN mtm.vote = true THEN 1
        ELSE 0
      END
    ) AS vote_count
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  LEFT JOIN members_to_members ON
    members_to_members.from_member_id = members.member_id AND
    members_to_members.to_member_id = members.member_id
  LEFT JOIN members_to_members as mtm ON
    mtm.to_member_id = members.member_id AND
    mtm.branch_id = nodes.parent_node_id
  WHERE
    members.user_id = $1 AND
    nodes.net_id = $2
  GROUP BY
    nodes.node_id,
    nodes.parent_node_id,
    members.confirmed,
    members_to_members.vote
`;
