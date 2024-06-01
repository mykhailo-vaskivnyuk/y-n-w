import { ITableNets } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetWait {
  connect: TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNets>;
  remove: TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNets>;
}

export const connect = `
  INSERT INTO nets_guests (
    net_id, user_id
  )
  VALUES ($1, $2)
  RETURNING *
`;

export const remove = `
  DELETE FROM nets_guests
  WHERE
    net_id = $1 AND
    user_id = $2
`;
