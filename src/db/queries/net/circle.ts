import { IMemberResponse } from '../../../client/common/server/types/types';
import { TQuery } from '../../types/types';
import { IMember } from '../../../domain/types/member.types';

export interface IQueriesNetCircle {
  getData: TQuery<
    [['node_id', number], ['parent_node_id', number]],
    IMemberResponse
  >;
  getMembers: TQuery<
    [['node_id', number], ['parent_node_id', number]],
    IMember
  >;
}

export const getData = `
  SELECT
    nodes.node_id,
    nodes.count_of_members,
    members.user_id,
    members.confirmed,
    users.name,
    null AS member_name,
    null AS token,
    members_to_members.dislike,
    members_to_members.vote,
    SUM (
      CASE
        WHEN votes.vote = true THEN 1
        ELSE 0
      END
    ) AS vote_count
  FROM nodes
  LEFT JOIN members AS members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  LEFT JOIN users ON
    users.user_id = members.user_id
  LEFT JOIN members_to_members ON
    members_to_members.to_member_id = members.member_id AND
    members_to_members.from_member_id = $1
  LEFT JOIN members_to_members AS votes ON
    votes.to_member_id = members.member_id AND
    votes.branch_id = $2
  WHERE
    nodes.node_id = $2 OR
    nodes.parent_node_id = $2 AND
    nodes.node_id <> $1
  GROUP BY
    nodes.node_id,
    nodes.count_of_members,
    members.user_id,
    members.confirmed,
    users.name,
    member_name,
    token,
    members_to_members.dislike,
    members_to_members.vote
  ORDER BY nodes.node_level, nodes.node_position
`;

export const getMembers = `
  SELECT
    nodes.*,
    nodes.node_id::int,
    nodes.parent_node_id::int,
    nodes.net_id::int,
    members.user_id::int,
    members.confirmed
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    nodes.node_id = $2 OR
    nodes.parent_node_id = $2 AND
    nodes.node_id <> $1
`;
