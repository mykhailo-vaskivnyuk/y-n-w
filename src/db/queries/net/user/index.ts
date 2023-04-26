import { ITableMembers } from '../../../types/db.tables.types';
import { TQuery } from '../../../types/types';

export interface IQueriesNetUser {
  createFirstMember: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableMembers>;
  connect: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableMembers>;
}

export const createFirstMember = `
  INSERT INTO members (
    member_id, user_id, confirmed
  )
  VALUES ($1, $2, true)
  RETURNING *
`;

export const connect = `
  INSERT INTO members (
    node_id, user_id
  )
  VALUES ($1, $2)
  RETURNING *
`;
