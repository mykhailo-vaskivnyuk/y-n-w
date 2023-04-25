import * as T from './db.tables.types';

export type IMemberWithNetId = T.ITableMembers & Pick<T.ITableNets, 'net_id'>;

export type IUserNetData =
  T.ITableNodes &
  Pick<T.ITableNets, 'net_id' | 'net_level'> &
  Pick<T.ITableNetsData, 'name' | 'goal'> &
  Pick<T.ITableMembers, 'user_id' | 'confirmed'>;

export type IUserNodeAndNetName =
  T.ITableNodes &
  Pick<T.ITableNetsData, 'name'>;

export type IMemberWithNet =
  Omit<IMember, 'user_id'> &
  Pick<T.ITableNetsData, 'name'>;

export type IMember =
  T.ITableNodes &
  Pick<T.ITableMembers, 'user_id' | 'confirmed'> &
  Pick<T.ITableNets, 'net_id'>;

export type INodeWithUser =
  T.ITableNodes &
  T.OuterJoin<Pick<T.ITableMembersInvites, 'token'>> &
  T.OuterJoin<Pick<T.ITableMembers, 'user_id' | 'confirmed'>>;

export type IMemberDislikes =
  Pick<T.ITableMembers, 'user_id'> &
  Pick<T.ITableNets, 'net_id'> &
  { dislike_count: number };

export type IMemberVotes =
  Pick<T.ITableNodes, 'node_id'> & {
  vote_count: number;
};
