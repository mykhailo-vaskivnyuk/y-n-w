/* eslint-disable max-lines */
import { ITableNets, ITableNetsData } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';
import { IQueriesNetUser } from './user';
import { IQueriesNetCircle } from './circle';
import { IQueriesNetTree } from './tree';
import { IQueriesNetFind } from './find';
import { IQueriesNetMessage } from './message';
import { IQueriesNetBoard } from './board';

export interface IQueriesNet {
  createInitial: TQuery<[
    ['node_id', number],
  ], ITableNets>;
  setRootNet: TQuery<[
    ['net_id', number],
  ], ITableNets>;
  createChild: TQuery<[
    ['parent_net_id', number],
    ['node_id', number],
  ], ITableNets>;
  createData: TQuery<[
    ['net_id', number],
    ['name', string],
  ], ITableNetsData>;
  update: TQuery<[
    ['net_id', number],
    ['goal', string],
  ], ITableNetsData>;
  updateCountOfNets: TQuery<[
    ['net_id', number | null],
    ['addCount', number],
  ], ITableNets>;
  remove: TQuery<[
    ['net_id', number],
  ]>;
  changeNode: TQuery<[
    ['node_id', number],
    ['new_node_id', number],
  ], ITableNets>;
  user: IQueriesNetUser;
  circle: IQueriesNetCircle;
  tree: IQueriesNetTree;
  find: IQueriesNetFind;
  message: IQueriesNetMessage;
  board: IQueriesNetBoard;
}

export const createInitial = `
  INSERT INTO nets (node_id)
  VALUES ($1)
  RETURNING *
`;

export const setRootNet = `
  UPDATE nets
  SET root_net_id = $1
  WHERE net_id = $1
  RETURNING *
`;

export const createChild = `
  INSERT INTO nets (
    node_id,
    net_level,
    parent_net_id,
    root_net_id
  )
  SELECT
    $2,
    net_level + 1,
    $1,
    root_net_id
  FROM nets
  WHERE net_id = $1
  RETURNING *
`;

export const createData = `
  INSERT INTO nets_data (
    net_id, name
  )
  VALUES ($1, $2)
  RETURNING *
`;

export const update = `
  UPDATE nets_data
  SET goal = $2
  WHERE net_id = $1
`;

export const updateCountOfNets = `
  UPDATE nets
  SET count_of_nets = count_of_nets + $2
  WHERE net_id = $1
  RETURNING *
`;

export const remove = `
  DELETE FROM nets
  WHERE net_id = $1
`;

export const changeNode = `
  UPDATE nets
  SET node_id = $2
  WHERE node_id = $1
`;
