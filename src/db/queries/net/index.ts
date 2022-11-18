import { ITableNets, ITableNetsData } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesNetUser } from './user';

export interface IQueriesNet {
  create:TQuery<[
    ['node_id', number],
  ], ITableNets>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
  createData:TQuery<[
    ['net_id', number],
    ['name', string],
  ], ITableNetsData>;
  user: IQueriesNetUser;
}

export const create = `
  INSERT INTO nets (node_id)
  VALUES ($1)
  RETURNING *
`;

export const remove = `
  DELETE FROM nets WHERE node_id = $1
`;

export const createData = `
  INSERT INTO nets_data (net_id, name)
  VALUES ($1, $2)
  RETURNING *
`;
