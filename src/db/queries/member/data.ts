import { TQuery } from '../../types/types';

export interface IQueriesMemberData {
  setDislike: TQuery<[
    ['branch_id', number],
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  unsetDislike: TQuery<[
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  setVote: TQuery<[
    ['branch_id', number],
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  unsetVote: TQuery<[
    ['from_member_id', number],
    ['to_member_id', number],
  ]>;
  removeFromCircle: TQuery<[
    ['node_id', number],
    ['branch_id', number | null],
  ]>;
  removeFromTree: TQuery<[
    ['node_id', number],
  ]>;
}

export const setDislike = `
  INSERT INTO members_to_members AS mtm (
    branch_id,
    from_member_id,
    to_member_id,
    dislike
  )
  VALUES ($1, $2, $3, true)
  ON CONFLICT (from_member_id, to_member_id)
    DO UPDATE
    SET
      branch_id = EXCLUDED.branch_id,
      dislike = EXCLUDED.dislike
    WHERE
      mtm.from_member_id = $1 AND
      mtm.to_member_id = $2
`;

export const unsetDislike = `
  UPDATE members_to_members
  SET dislike = false
  WHERE
    from_member_id = $1 AND
    to_member_id = $2
`;

export const setVote = `
  INSERT INTO members_to_members AS mtm (
    branch_id,
    from_member_id,
    to_member_id,
    vote
  )
  VALUES ($1, $2, true)
  ON CONFLICT (from_member_id, to_member_id)
    DO UPDATE
    SET
      branch_id = EXCLUDED.branch_id,
      vote = EXCLUDED.vote
    WHERE
      mtm.from_member_id = $1 AND
      mtm.to_member_id = $2
`;

export const unsetVote = `
  UPDATE members_to_members
  SET vote = false
  WHERE
    from_member_id = $1 AND
    to_member_id = $2
`;

export const removeFromCircle = `
  DELETE FROM members_to_members AS mtm
  WHERE
    branch_id = $2 AND (
      from_member_id = $1 OR
      to_member_id = $1
  )
`;

export const removeFromTree = `
  DELETE FROM members_to_members AS mtm
  WHERE
    branch_id = $1 AND (
      from_member_id = $1 OR
      to_member_id = $1
  )
`;
