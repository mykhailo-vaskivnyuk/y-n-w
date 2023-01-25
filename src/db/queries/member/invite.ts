import { TQuery } from '../../types/types';

export interface IQueriesMemberInvite {
  create: TQuery<[
    ['parent_node_id', number],
    ['node_id', number],
    ['member_name', string],
    ['token', string],
  ]>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
  confirm: TQuery<[
    ['node_id', number],
  ]>;
}

export const create = `
  INSERT INTO nodes_invites (
    parent_node_id, node_id, member_name, token
  )
  VALUES ($1, $2, $3, $4)
`;

export const remove = `
  DELETE FROM nodes_invites
  WHERE node_id = $1
`;

export const confirm = `
  UPDATE nets_users_data
  SET confirmed = true
  WHERE node_id = $1
`;
