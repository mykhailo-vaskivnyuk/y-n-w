import {
  ITableNets, ITableNetsData, ITableNetsUsersData,
} from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNetUser {
  remove: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ]>;
  createData:TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
  readData:TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNets & ITableNetsData>;
}

export const remove = `
  DELETE FROM nets_users_data
  WHERE user_id = $1 AND net_id = $2
`;

export const createData = `
  INSERT INTO nets_users_data (net_id, user_id)
  VALUES ($1, $2)
  RETURNING *
`;

export const readData = `
  SELECT * FROM nets_users_data
  LEFT JOIN nets ON nets_users_data.net_id = nets.net_id
  INNER JOIN nets_data ON nets.net_id = nets_data.net_id
  WHERE nets_users_data.user_id = $1 AND nets.net_id = $2
`;
