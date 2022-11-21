import { ITableNets, ITableNetsData } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesNetUser } from './user';

export interface IQueriesNet {
  createInitial: TQuery<[
    ['node_id', number],
  ], ITableNets>;
  createChild: TQuery<[
    ['parent_net_id', number],
    ['node_id', number],
  ], ITableNets>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
  createData: TQuery<[
    ['net_id', number],
    ['name', string],
  ], ITableNetsData>;
  getParents: TQuery<[
    ['net_id', number],
  ], ITableNetsData>;
  updateCountOfNets: TQuery<[
    ['parent_net_id', number],
    ['addCount', number],
  ], ITableNets>
  user: IQueriesNetUser;
}

export const createInitial = `
  INSERT INTO nets (node_id, first_node_id)
  VALUES ($1, $1)
  RETURNING *
`;

export const createChild = `
INSERT INTO nets (
  net_level,
  parent_net_id,
  first_net_id,
  count_of_nets,
  node_id)
SELECT
  net_level + 1,
  net_id,
  first_net_id,
  count_of_nets + 1, 
  $2
FROM nets
WHERE net_id = $1
RETURNING *
`;

export const remove = `
  DELETE FROM nets
  WHERE node_id = $1
  RETURNING *
`;

export const createData = `
  INSERT INTO nets_data (net_id, name)
  VALUES ($1, $2)
  RETURNING *
`;

export const getParents = `
  SELECT nets_data.*
  FROM nets as net
  INNER JOIN nets
    ON net.first_net_id = nets.first_net_id
  INNER JOIN nets_data
    ON nets_data.net_id = nets.net_id
  WHERE
    net.net_id = $1 AND
    nets.net_level < net.net_level
  ORDER BY nets.net_level
`;

export const updateCountOfNets = `
  UPDATE nets
  SET count_of_nets = count_of_nets + $2
  WHERE net_id = $1
  RETURNING *
`;
