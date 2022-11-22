import { ITableNets, ITableNetsData } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNet {
  read: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNets & ITableNetsData>;
  getChildren: TQuery<[
    ['user_id', number],
    ['parent_net_id', number | null],
  ], ITableNetsData>;
}

export const read = `
  SELECT nets_users_data.* FROM nets_users_data
  LEFT JOIN nets ON nets_users_data.net_id = nets.net_id
  INNER JOIN nets_data ON nets.net_id = nets_data.net_id
  WHERE nets_users_data.user_id = $1 AND nets.net_id = $2
`;

export const getChildren = `
  SELECT nets_data.*
  FROM nets_data
  INNER JOIN nets ON nets_data.net_id = nets.net_id
  RIGHT JOIN nets_users_data ON nets_users_data.net_id = nets.net_id
  WHERE
  nets_users_data.user_id = $1 AND
  (
    (
      ($2 + 1) ISNULL AND nets.parent_net_id ISNULL
    ) OR (
      ($2 + 1) NOTNULL AND nets.parent_net_id = $2
    )
  )
`;
