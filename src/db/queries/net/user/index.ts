import { ITableNetsUsersData } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNetUser {
  createData: TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
}

export const createData = `
  INSERT INTO nets_users_data (net_id, user_id)
  VALUES ($1, $2)
  RETURNING *
`;
