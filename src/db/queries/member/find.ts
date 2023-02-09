/* eslint-disable max-lines */
import { ITableNetsUsersData } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesMemberFind {
  unactive: TQuery<[
    ['date', string],
  ], ITableNetsUsersData>;
}

export const unactive = `
  SELECT *,
    nets_users_data.net_id::int,
    nets_users_data.user_id::int
  FROM nets_users_data
  WHERE
    nets_users_data.active_date < $1 AND
    nets_users_data.confirmed = true
  LIMIT 1
`;
