import { ITableNets, ITableNetsData } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesNetUser } from './user';
import { IQueriesNetNodes } from './nodes/removeUser';
import { IQueriesNetCircle } from './circle';
import { IQueriesNetTree } from './tree';

export interface IQueriesNet {
  createInitial: TQuery<[
    ['node_id', number],
  ], ITableNets>;
  setFirstNetId: TQuery<[
    ['net_id', number],
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
  updateCountOfNets: TQuery<[
    ['parent_net_id', number],
    ['addCount', number],
  ], ITableNets>
  user: IQueriesNetUser;
  nodes: IQueriesNetNodes;
  circle: IQueriesNetCircle;
  tree: IQueriesNetTree;
}

export const createInitial = `
  INSERT INTO nets (node_id, count_of_nets)
  VALUES ($1, 1)
  RETURNING *
`;

export const setFirstNetId = `
  UPDATE nets
  SET first_net_id = $1
  WHERE net_id = $1
  RETURNING *
`;

export const createChild = `
  INSERT INTO nets (
    net_level,
    parent_net_id,
    first_net_id,
    node_id)

  SELECT
    net_level + 1,
    net_id,
    first_net_id,
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

export const updateCountOfNets = `
  UPDATE nets
  SET count_of_nets = count_of_nets + $2
  WHERE net_id = $1
  RETURNING *
`;
