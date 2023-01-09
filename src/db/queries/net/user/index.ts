import { ITableNetsUsersData } from '../../../db.types';
import { TQuery } from '../../../types';
import { userNetAndItsSubnets } from '../../../utils';

export interface IQueriesNetUser {
  createData: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
  connect: TQuery<[
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
    node_id, net_node_id, user_id, confirmed
  )
  SELECT $1, net_node_id, $2, true
  FROM nodes
  WHERE node_id = $1
  RETURNING *
`;

export const connect = `
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
    SELECT nets_users_data.net_node_id
    FROM nets_users_data
    INNER JOIN nets ON
      nets.net_node_id = nets_users_data.net_node_id
    WHERE ${userNetAndItsSubnets()}
  )
`;
