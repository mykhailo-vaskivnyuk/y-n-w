import * as T from './db.types';
import { INetMember } from './member.types';

export type INet = T.ITableNets & T.ITableNetsData;

export type IUserNet =
  T.ITableNodes &
  Pick<T.ITableMembers, 'user_id' | 'confirmed'> &
  T.ITableNets &
  Pick<T.ITableNetsData, 'name'>;

/* net structure */
export type INetNode = {
  member: INetMember,
  tree: INetNode[] | null,
  connection: boolean,
};
