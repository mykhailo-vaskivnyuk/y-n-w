import { TQuery } from '../../types/types';

export interface IQueriesMemberInvite {
  create: TQuery<
    [
      ['member_id', number],
      ['node_id', number],
      ['member_name', string],
      ['token', string],
    ]
  >;
  remove: TQuery<[['node_id', number]]>;
  removeAll: TQuery<[['member_id', number]]>;
}

export const create = `
  INSERT INTO members_invites (
    member_id, node_id, member_name, token
  )
  VALUES ($1, $2, $3, $4)
`;

export const remove = `
  DELETE FROM members_invites
  WHERE node_id = $1
`;

export const removeAll = `
  DELETE FROM members_invites
  WHERE member_id = $1
`;
