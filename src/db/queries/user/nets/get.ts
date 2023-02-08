import {
  ITableNets, ITableNetsData, ITableNetsUsersData, ITableNodes,
} from '../../../db.types';
import { TQuery } from '../../../types/types';

export interface IQueriesUserNets {
  get: TQuery<[
    ['user_id', number],
  ],
    ITableNodes &
    ITableNets &
    Pick<ITableNetsData, 'name'> &
    Pick<ITableNetsUsersData, 'user_id' | 'confirmed'>
  >;
}

const get = `
  SELECT
    nets.*,
    nodes.*,
    nodes.node_id::int,
    nodes.net_id::int,
    nodes.parent_node_id::int,
    nets_data.name,
    nets_users_data.user_id,
    nets_users_data.confirmed
  FROM nets_users_data
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  INNER JOIN nets ON
    nets.net_id = nets_users_data.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id
  WHERE nets_users_data.user_id = $1
  ORDER BY nets.net_level
`;

export default get;
