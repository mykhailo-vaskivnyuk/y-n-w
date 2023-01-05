import { ITableNetsUsersData } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNetUser {
  createData: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
  remove: TQuery<[
    ['net_node_id', number | null],
    ['user_id', number],
  ]>;
}

export const createData = `
  INSERT INTO nets_users_data (
    node_id, net_node_id, user_id
  )
  SELECT $1, net_node_id, $2
  FROM nodes
  WHERE node_id = $1
  RETURNING *
`;

export const remove = `
  DELETE FROM nets_users_data
  WHERE user_id = $2 AND net_node_id IN (
    SELECT net_node_id
    FROM nets_users_data
    INNER JOIN net ON
      nets.net_node_id = nets_users_data.net_node_id
    WHERE
      nets_users_data.user_id = $2 AND ((
        ($1 + 1) NOTNULL AND
        nets.first_net_id = $1 AND
        nets.net_level >= (SELECT net_level FROM nets WHERE net_node_id = $1)
      ) OR ($1 + 1) ISNULL)
    )
`;
