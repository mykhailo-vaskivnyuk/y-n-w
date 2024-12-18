import { ITableNetsData } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetData {
  get: TQuery<[['net_id', number]], ITableNetsData>;
  create: TQuery<
    [['net_id', number], ['name', string], ['token', string]],
    ITableNetsData
  >;
  update: TQuery<[['net_id', number], ['goal', string]]>;
}

export const get = `
  SELECT nets_data.*
  FROM nets_data
  WHERE net_id = $1
`;

export const create = `
  INSERT INTO nets_data (
    net_id, name, net_link
  )
  VALUES ($1, $2, $3)
  RETURNING *
`;

export const update = `
  UPDATE nets_data
  SET goal = $2
  WHERE net_id = $1
`;
