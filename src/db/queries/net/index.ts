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
    ['net_id', number],
  ], ITableNets>;
  createChild: TQuery<[
    ['net_id', number],
    ['parent_net_id', number],
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
  changeNet: TQuery<[
    ['net_id', number],
    ['new_net_id', number],
  ]>;
  changeParent: TQuery<[
    ['net_id', number],
    ['new_net_id', number],
  ]>;
  changeFirstNet: TQuery<[
    ['net_id', number],
    ['new_net_id', number],
  ]>;
  user: IQueriesNetUser;
  circle: IQueriesNetCircle;
  tree: IQueriesNetTree;
  find: IQueriesNetFind;
  message: IQueriesNetMessage;
  board: IQueriesNetBoard;
}

export const createInitial = `
  INSERT INTO nets (net_id, first_net_id)
  VALUES ($1, $1)
  RETURNING *
`;

export const createChild = `
  INSERT INTO nets (
    net_id,
    net_level,
    parent_net_id,
    first_net_id
  )
  SELECT
    $1,
    net_level + 1,
    $2,
    first_net_id
  FROM nets
  WHERE net_id = $2
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

export const changeNet = `
  UPDATE nets
  SET net_id = $2
  WHERE net_id = $1
`;

export const changeParent = `
  UPDATE nets
  SET parent_net_id = $2
  WHERE parent_net_id = $1
`;

export const changeFirstNet = `
  UPDATE nets
  SET first_net_id = $2
  WHERE first_net_id = $1
`;
