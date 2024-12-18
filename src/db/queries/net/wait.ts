import { INetWaiting } from '../../../client/common/server/types/types';
import { ITableNets } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetWait {
  get: TQuery<[['net_id', number]], INetWaiting>;
  create: TQuery<
    [['net_id', number], ['user_id', number], ['comment', string]],
    ITableNets
  >;
  remove: TQuery<[['net_id', number], ['user_id', number]], ITableNets>;
}

export const get = `
  SELECT
    users.name,
    nets_guests.comment
  FROM nets_guests
  INNER JOIN users ON
    users.user_id = nets_guests.user_id
  WHERE net_id = $1
`;

export const create = `
  INSERT INTO nets_guests (
    net_id, user_id, comment
  )
  VALUES ($1, $2, $3)
  RETURNING *
`;

export const remove = `
  DELETE FROM nets_guests
  WHERE
    net_id = $1 AND
    user_id = $2
`;
