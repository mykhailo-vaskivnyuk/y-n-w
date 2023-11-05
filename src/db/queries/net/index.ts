/* eslint-disable max-lines */
import {
  INetResponse, OmitNull,
} from '../../../client/common/server/types/types';
import { ITableNets } from '../../../domain/types/db.tables.types';
import { TQuery } from '../../types/types';
import { IQueriesNetData } from './data';
import { IQueriesNetCircle } from './circle';
import { IQueriesNetTree } from './tree';
import { IQueriesNetBranch } from './branch';
import { IQueriesNetFind } from './find';
import { IQueriesNetBoard } from './boardMessages';
import { IQueriesNetUsers } from './users';

export interface IQueriesNet {
  createRoot: TQuery<[], ITableNets>;
  setRootNet: TQuery<[
    ['net_id', number],
  ], ITableNets>;
  createChild: TQuery<[
    ['parent_net_id', number],
  ], ITableNets>;
  updateCountOfNets: TQuery<[
    ['net_id', number | null],
    ['addCount', number],
  ], ITableNets>;
  remove: TQuery<[
    ['net_id', number],
  ]>;
  get: TQuery<[
    ['net_id', number],
  ], OmitNull<INetResponse>>
  lock: TQuery<[
    ['net_id', number],
  ]>;
  data: IQueriesNetData;
  circle: IQueriesNetCircle;
  tree: IQueriesNetTree;
  branch: IQueriesNetBranch;
  find: IQueriesNetFind;
  boardMessages: IQueriesNetBoard;
  users: IQueriesNetUsers;
}

export const createRoot = `
  INSERT INTO nets
  DEFAULT VALUES
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
    parent_net_id, root_net_id, net_level
  )
    SELECT $1, root_net_id, net_level + 1
    FROM nets
    WHERE net_id = $1
  RETURNING *
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

export const get = `
  SELECT
    nodes.node_id::int,
    nodes.parent_node_id::int,
    nets.net_id,
    nets.net_level,
    nets.parent_net_id,
    nets_data.name,
    nets_data.goal,
    root_node.count_of_members AS total_count_of_members
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  INNER JOIN nets ON
    nets.net_id = nodes.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id
  INNER JOIN nodes AS root_node ON
    root_node.net_id = nets.net_id AND
    root_node.parent_node_id ISNULL
  WHERE nodes.net_id = $1
`;

export const lock = `
  SELECT * FROM nets
  WHERE net_id = $1
  FOR UPDATE
`;
