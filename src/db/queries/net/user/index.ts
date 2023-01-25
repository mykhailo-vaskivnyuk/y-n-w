import { ITableNetsUsersData } from '../../../db.types';
import { TQuery } from '../../../types/types';

export interface IQueriesNetUser {
  createData: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
  connect: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
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
