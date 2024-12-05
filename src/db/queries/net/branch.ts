import { TQuery } from '../../types/types';
import {
  IBranchDislikes,
  IBranchVotes,
} from '../../../domain/types/member.types';

export interface IQueriesNetBranch {
  getDislikes: TQuery<[['branch_id', number]], IBranchDislikes>;
  getVotes: TQuery<[['branch_id', number]], IBranchVotes>;
}

export const getDislikes = `
  SELECT
    nodes.node_id::int,
    SUM (
      CASE
        WHEN mtm.dislike = true THEN 1
        ELSE 0
      END
    ) AS dislike_count
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  LEFT JOIN members_to_members AS mtm ON
    mtm.to_member_id = members.member_id AND
    mtm.branch_id = $1
  WHERE
    nodes.parent_node_id = $1 OR
    nodes.node_id = $1
  GROUP BY
    nodes.node_id
  ORDER BY dislike_count DESC
`;

export const getVotes = `
  SELECT
    nodes.node_id::int,
    SUM (
      CASE
        WHEN mtm.vote = true THEN 1
        ELSE 0
      END
    )::int AS vote_count
  FROM nodes
  INNER JOIN members AS members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  LEFT JOIN members_to_members AS mtm ON
    mtm.to_member_id = members.member_id AND
    mtm.branch_id = $1
  WHERE
    nodes.parent_node_id = $1
  GROUP BY
    nodes.node_id
  ORDER BY vote_count DESC
`;
