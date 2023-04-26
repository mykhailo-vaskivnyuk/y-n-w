/* eslint-disable max-lines */
import { TQuery } from '../../types/types';
import { userInNetAndItsSubnets } from '../../utils';

export interface IQueriesMemberData {
  setDislike: TQuery<[
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  unsetDislike: TQuery<[
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  setVote: TQuery<[
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  unsetVote: TQuery<[
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  removeFromCircle: TQuery<[
    ['node_id', number],
    ['parent_node_id', number | null],
  ]>;
  removeFromTree: TQuery<[
    ['node_id', number],
  ]>;
}

export const setDislike = `
  INSERT INTO members_to_members AS mtm (
    from_member_id, to_member_id, dislike)
  VALUES ($1, $2, true)
  ON CONFLICT (from_member_id, to_member_id)
    DO UPDATE
    SET dislike = EXCLUDED.dislike
    WHERE mtm.from_member_id = $1 AND mtm.to_member_id = $2
`;

export const unsetDislike = `
  UPDATE members_to_members
  SET dislike = false
  WHERE from_member_id = $1 AND to_member_id = $2
`;

export const setVote = `
  INSERT INTO members_to_members AS mtm (from_member_id, to_member_id, vote)
  VALUES ($1, $2, true)
  ON CONFLICT (from_member_id, to_member_id)
    DO UPDATE
    SET vote = EXCLUDED.vote
    WHERE mtm.from_member_id = $1 AND mtm.to_member_id = $2
`;

export const unsetVote = `
  UPDATE members_to_members
  SET vote = false
  WHERE from_member_id = $1 AND to_member_id = $2
`;

export const removeFromCircle = `
  DELETE FROM members_to_members AS mtm
  WHERE (
    from_member_id = $1 AND
    to_member_id IN (
      SELECT nodes.node_id from nodes
      WHERE nodes.parent_node_id = $2 OR nodes.node_id = $2
    )
  ) AND (
    to_member_id = $1 AND
    from_member_id IN (
      SELECT nodes.node_id from nodes
      WHERE nodes.parent_node_id = $2 OR nodes.node_id = $2
    )
  )
`;

export const removeFromTree = `
  DELETE FROM members_to_members AS mtm
  WHERE (
    from_member_id = $1 AND
    to_member_id IN (
      SELECT nodes.node_id from nodes
      WHERE nodes.parent_node_id = $1
    )
  ) AND (
    to_member_id = $1 AND
    from_member_id IN (
      SELECT nodes.node_id from nodes
      WHERE nodes.parent_node_id = $1
    )
  )
`;
