import {
  ITableNets, ITableNetsData, ITableNodes,
} from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNets {
  get: TQuery<[
    ['user_id', number],
  ],
    ITableNodes &
    ITableNets &
    ITableNetsData
  >;
}

const get = `
  SELECT
    nodes.node_id, nodes.parent_node_id,
    nets.*,
    nets_data.name 
  FROM nets_users_data
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  INNER JOIN nets ON
    nets.net_node_id = nets_users_data.net_node_id
  INNER JOIN nets_data ON
    nets_data.net_node_id = nets.net_node_id
  WHERE nets_users_data.user_id = $1
  ORDER BY nets.net_level
`;

export default get;
