import * as T from './db.tables.types';

export type IUserNetData =
  T.ITableNodes &
  Pick<T.ITableNets, 'net_level'> &
  Pick<T.ITableNetsData, 'name'> &
  Pick<T.ITableNetsUsersData, 'user_id' | 'confirmed'>;

export type IUserNodeAndNetName =
  T.ITableNodes &
  Pick<T.ITableNetsData, 'name'>;

export type IMemberWithNet =
  Omit<IMember, 'user_id'> &
  Pick<T.ITableNetsData, 'name'>;

export type IMember =
  T.ITableNodes &
  Pick<T.ITableNetsUsersData, 'user_id' | 'confirmed'>;

export type INodeWithUser =
  T.ITableNodes &
  T.OuterJoin<Pick<T.ITableUsersNodesInvites, 'token'>> &
  T.OuterJoin<Pick<T.ITableNetsUsersData, 'user_id' | 'confirmed'>>;

export type IMemberDislikes =
  Pick<T.ITableNetsUsersData, 'net_id' | 'user_id'> & {
  dislike_count: number;
};

export type IMemberVotes =
  Pick<T.ITableNetsUsersData, 'node_id'> & {
  vote_count: number;
};
