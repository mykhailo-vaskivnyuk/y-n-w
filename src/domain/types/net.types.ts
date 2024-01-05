import * as T from './db.types';

export type INet = T.ITableNets & T.ITableNetsData;

export type IUserNet =
  T.ITableNodes &
  Pick<T.ITableMembers, 'user_id' | 'confirmed'> &
  T.ITableNets &
  Pick<T.ITableNetsData, 'name'>;
