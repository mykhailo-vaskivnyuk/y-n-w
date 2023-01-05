import { ITableNets, ITableNetsData } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesNetUser } from './user';
import { IQueriesNetNodes } from './nodes/removeUser';
import { IQueriesNetCircle } from './circle';
import { IQueriesNetTree } from './tree';
import { IQueriesNetFind } from './find';

export interface IQueriesNet {
  createInitial: TQuery<[
    ['net_node_id', number],
  ], ITableNets>;
  createChild: TQuery<[
    ['net_node_id', number],
    ['parent_net_id', number],
  ], ITableNets>;
  remove: TQuery<[
    ['net_node_id', number],
  ]>;
  createData: TQuery<[
    ['net_node_id', number],
    ['name', string],
  ], ITableNetsData>;
  updateCountOfNets: TQuery<[
    ['parent_net_id', number],
    ['addCount', number],
  ], ITableNets>
  user: IQueriesNetUser;
  nodes: IQueriesNetNodes;
  circle: IQueriesNetCircle;
  tree: IQueriesNetTree;
  find: IQueriesNetFind;
}

export const createInitial = `
  INSERT INTO nets (
    net_node_id, first_net_id
  )
  VALUES ($1, $1)
  RETURNING *
`;

export const createChild = `
  INSERT INTO nets (
    net_node_id,
    net_level,
    parent_net_id,
    first_net_id
  )
  SELECT
    $1,
    net_level + 1,
    net_node_id,
    first_net_id
  FROM nets
  WHERE net_node_id = $2
  RETURNING *
`;

export const remove = `
  DELETE FROM nets
  WHERE net_node_id = $1
  RETURNING *
`;

export const createData = `
  INSERT INTO nets_data (
    net_node_id, name
  )
  VALUES ($1, $2)
  RETURNING *
`;

export const updateCountOfNets = `
  UPDATE nets
  SET count_of_nets = count_of_nets + $2
  WHERE net_node_id = $1
  RETURNING *
`;
