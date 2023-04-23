import { ITableMembers } from '../../../types/db.tables.types';
import { TQuery } from '../../../types/types';

export interface IQueriesNetUser {
  createData: TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableMembers>;
  connect: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableMembers>;
}

export const createData = `
  INSERT INTO members (
    node_id, net_id, user_id, confirmed
  )
  VALUES ($1, $1, $2, true)
  RETURNING *
`;

export const connect = `
  INSERT INTO members (
    node_id, net_id, user_id
  )
  SELECT $1, net_id, $2
  FROM nodes
  WHERE node_id = $1
  RETURNING *
`;
