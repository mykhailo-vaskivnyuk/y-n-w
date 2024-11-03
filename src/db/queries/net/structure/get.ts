/* eslint-disable max-lines */
import { TQuery } from '../../../types/types';
import { INetMember } from '../../../../domain/types/member.types';

export interface IQueriesNetStructure {
  root: TQuery<[
    ['net_id', number],
  ], INetMember>;
  tree: TQuery<[
    ['node_id', number],
  ], INetMember>;
}

export const root = `
  SELECT
    nodes.*,
    members.*,
    members.user_id::int,
    false AS invite,
    SUM (
      CASE
        WHEN mtm.dislike = true THEN 1
        ELSE 0
      END
    )::int AS dislikes,
    0::int AS votes
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_to_members AS mtm ON
    mtm.to_member_id = members.member_id
  WHERE
    nodes.net_id = $1 AND
    parent_node_id ISNULL
  GROUP BY
    nodes.node_id,
    members.member_id
`;

export const tree = `
  SELECT 
    nodes.*,
    members.*,
    members.user_id::int,
    CASE
      WHEN mi.node_id ISNULL THEN false
      ELSE true
    END AS invite,
    SUM (
      CASE
        WHEN mtm.dislike = true THEN 1
        ELSE 0
      END
    )::int AS dislikes,
    SUM (
      CASE
        WHEN mtm.vote = true THEN 1
        ELSE 0
      END
    )::int AS votes
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_invites AS mi ON
    mi.node_id = nodes.node_id
  LEFT JOIN members_to_members AS mtm ON
    mtm.to_member_id = members.member_id
  WHERE nodes.parent_node_id = $1
  GROUP BY
    nodes.node_id,
    members.member_id,
    mi.node_id
  ORDER BY nodes.node_position
`;
