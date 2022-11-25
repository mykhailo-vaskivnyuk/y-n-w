import { ITableNetsUsersData } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNetUser {
  createData: TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
  remove: TQuery<[
    ['net_id', number | null],
    ['user_id', number],
  ]>;
}

export const createData = `
  INSERT INTO nets_users_data (net_id, user_id)
  VALUES ($1, $2)
  RETURNING *
`;

export const remove = `
  DELETE FROM nets_users_data
  WHERE user_id = $2 AND net_id IN (
    SELECT nets_users_data.net_id FROM nets_users_data
    RIGHT JOIN nets ON nets.net_id = nets_users_data.net_id
    WHERE
      user_id = $2 AND (
        (
          ($1 + 1) NOTNULL AND (
            nets.net_id = $1 OR
            nets.net_level > (SELECT net_level FROM nets WHERE net_id = $1)
          )
        ) OR (
          ($1 + 1) ISNULL AND true
        )
      )
  )
`;
