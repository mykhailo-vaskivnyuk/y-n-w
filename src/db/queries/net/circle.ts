/* eslint-disable max-lines */
import { IMemberResponse } from '../../../client/common/server/types/types';
import { TQuery } from '../../types/types';
import {
  IMember, IMemberDislikes, IMemberVotes,
} from '../../types/member.types';

export interface IQueriesNetCircle {
  get: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ], IMemberResponse>;
  getDislikes: TQuery<[
    ['parent_node_id', number],
  ], IMemberDislikes>;
  getVotes: TQuery<[
    ['parent_node_id', number],
  ], IMemberVotes>;
  getMembers: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ], IMember>;
}

export const get = `
  SELECT
    nodes.node_id,
    nodes.count_of_members,
    members.user_id,
    users.email AS name,
    members.confirmed,
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
  LEFT JOIN members_to_members ON
    members_to_members.from_member_id = $1 AND
    members_to_members.to_member_id = members.member_id
  LEFT JOIN users ON
    users.user_id = members.user_id
  LEFT JOIN members_to_members AS votes ON
    votes.to_member_id = members.member_id
  LEFT JOIN nodes AS ns ON
    ns.node_id = votes.from_member_id AND
    ns.parent_node_id = $2
  WHERE
    nodes.node_id <> $1 AND (
      nodes.node_id = $2 OR
      nodes.parent_node_id = $2
    )
  GROUP BY
    nodes.node_id,
    nodes.count_of_members,
    members.user_id,
    users.email,
    members.confirmed,
    members_to_members.dislike,
    members_to_members.vote
  ORDER BY nodes.node_level, nodes.node_position
`;

export const getDislikes = `
  SELECT
    nets.net_id,
    members.user_id,
    SUM (
      CASE
        WHEN members_to_members.dislike = true THEN 1
        ELSE 0
      END
    ) AS dislike_count
  FROM nodes
  INNER JOIN nets ON
    nets.node_id = nodes.root_node_id
  INNER JOIN members AS members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_to_members ON
    members_to_members.to_member_id = members.member_id
  LEFT JOIN nodes AS ns ON
    ns.node_id = members_to_members.from_member_id AND
    ns.parent_node_id = $1 OR ns.node_id = $1
  WHERE
    (
      nodes.parent_node_id = $1 OR
      nodes.node_id = $1
    ) AND
    members.confirmed = true
  GROUP BY
    nets.net_id,
    members.user_id
  ORDER BY dislike_count DESC
`;

export const getVotes = `
  SELECT
    nodes.node_id::int,
    SUM (
      CASE
        WHEN members_to_members.vote = true THEN 1
        ELSE 0
      END
    )::int AS vote_count
  FROM nodes
  INNER JOIN members AS members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_to_members ON
    members_to_members.to_member_id = members.member_id
  LEFT JOIN nodes AS ns ON
    ns.node_id = members_to_members.from_member_id AND
    ns.parent_node_id = $1
  WHERE
    nodes.parent_node_id = $1 AND
    members.confirmed = true
  GROUP BY
    nodes.node_id
  ORDER BY vote_count DESC
`;

export const getMembers = `
  SELECT
    nodes.*,
    nodes.node_id::int,
    nets.net_id::int,
    members.user_id::int,
    members.confirmed
  FROM nodes
  INNER JOIN nets ON
    nets.node_id = nodes.root_node_id
  INNER JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    nodes.node_id = $2 OR (
      nodes.parent_node_id = $2 AND
      nodes.node_id <> $1
    )
`;
