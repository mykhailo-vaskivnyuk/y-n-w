import { TQuery } from '../../types/types';

export interface IQueriesMemberInvite {
  create: TQuery<[
    ['node_id', number],
    ['member_node_id', number],
    ['member_name', string],
    ['token', string],
  ]>;
  remove: TQuery<[
    ['member_node_id', number],
  ]>;
  removeAll: TQuery<[
    ['node_id', number],
  ]>;
  confirm: TQuery<[
    ['node_id', number],
  ]>;
}

export const create = `
  INSERT INTO members_invites (
    node_id, member_node_id, member_name, token
  )
  VALUES ($1, $2, $3, $4)
`;

export const remove = `
  DELETE FROM members_invites
  WHERE member_node_id = $1
`;

export const removeAll = `
  DELETE FROM members_invites
  WHERE node_id = $1
`;

export const confirm = `
  UPDATE members
  SET confirmed = true
  WHERE node_id = $1
`;
