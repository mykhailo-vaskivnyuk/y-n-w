/* eslint-disable max-lines */
import { TQuery } from '../../types';

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
    ['net_node_id', number | null],
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
      FROM nets_users_data
      INNER JOIN nodes ON
        nodes.node_id = nets_users_data.node_id
      INNER JOIN nets ON
        nets.net_node_id = nets_users_data.net_node_id
      WHERE
        nets_users_data.user_id = $1 AND ((
          ($2 + 1) NOTNULL AND
          nets.first_net_id = $2 AND
          nets.net_level >= (SELECT net_level FROM nets WHERE net_node_id = $2)
          ) OR ($2 + 1) ISNULL
        )
      ORDER BY nets.net_level DESC
    ) OR
    parent_node_id in (
      SELECT nets_users_data.node_id
      FROM nets_users_data
      INNER JOIN nets ON
        nets.net_node_id = nets_users_data.net_node_id
      WHERE
        nets_users_data.user_id = $1 AND ((
          ($2 + 1) NOTNULL AND
          nets.first_net_id = $2 AND
          nets.net_level >= (SELECT net_level FROM nets WHERE net_node_id = $2)
          ) OR ($2 + 1) ISNULL
        )
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
