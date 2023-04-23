/* eslint-disable max-lines */
import { TQuery } from '../../types/types';
import { userInNetAndItsSubnets } from '../../utils';

export interface IQueriesMemberData {
  setDislike: TQuery<[
    ['parent_node_id', number],
    ['user_id', number],
    ['member_id', number],
  ]>;
  unsetDislike: TQuery<[
    ['parent_node_id', number],
    ['user_id', number],
    ['member_id', number],
  ]>;
  setVote: TQuery<[
    ['parent_node_id', number],
    ['user_id', number],
    ['member_id', number],
  ]>;
  unsetVote: TQuery<[
    ['parent_node_id', number],
    ['user_id', number],
  ]>;
  remove: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ]>;
  removeFromCircle: TQuery<[
    ['user_id', number],
    ['parent_node_id', number | null],
  ]>;
  removeFromTree: TQuery<[
    ['user_id', number],
    ['node_id', number],
  ]>;
}

export const setDislike = `
  INSERT INTO users_members AS um (
    parent_node_id, user_id, member_id, dislike)
  VALUES ($1, $2, $3, true)
  ON CONFLICT (parent_node_id, user_id, member_id)
    DO UPDATE
    SET dislike = EXCLUDED.dislike
    WHERE um.parent_node_id = $1 AND um.user_id = $2 AND um.member_id = $3 
`;

export const unsetDislike = `
  UPDATE users_members
  SET dislike = false
  WHERE parent_node_id = $1 AND user_id = $2 AND member_id = $3 
`;

export const setVote = `
  INSERT INTO users_members AS um (parent_node_id, user_id, member_id, vote)
  VALUES ($1, $2, $3, true)
  ON CONFLICT (parent_node_id, user_id, member_id)
    DO UPDATE
    SET vote = EXCLUDED.vote
    WHERE um.parent_node_id = $1 AND um.user_id = $2 AND um.member_id = $3
`;

export const unsetVote = `
  UPDATE users_members
  SET vote = false
  WHERE parent_node_id = $1 AND user_id = $2
`;

export const remove = `
  DELETE FROM users_members
  WHERE (
      user_id = $1 OR
      member_id = $1
    ) AND
    parent_node_id in (
      SELECT nodes.parent_node_id
      FROM members
      INNER JOIN nodes ON
        nodes.node_id = members.node_id
      INNER JOIN nets ON
        nets.net_id = members.net_id
      WHERE ${userInNetAndItsSubnets()}
      ORDER BY nets.net_level DESC
    ) OR
    parent_node_id in (
      SELECT members.node_id
      FROM members
      INNER JOIN nets ON
        nets.net_id = members.net_id
      WHERE ${userInNetAndItsSubnets()}
      ORDER BY nets.net_level DESC
    )
`;

export const removeFromCircle = `
  DELETE FROM users_members
  WHERE (
      user_id = $1 OR
      member_id = $1
    ) AND 
    parent_node_id = $2
`;

export const removeFromTree = `
  DELETE FROM users_members
  WHERE (
      user_id = $1 OR
      member_id = $1
    ) AND 
    parent_node_id = $2
`;
