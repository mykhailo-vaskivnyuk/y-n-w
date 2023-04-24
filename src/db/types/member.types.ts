import * as T from './db.tables.types';

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
  Pick<T.ITableMembers, 'net_id' | 'user_id' | 'confirmed'>;

export type INodeWithUser =
  T.ITableNodes &
  T.OuterJoin<Pick<T.ITableMembersInvites, 'token'>> &
  T.OuterJoin<Pick<T.ITableMembers, 'user_id' | 'confirmed'>>;

export type IMemberDislikes =
  Pick<T.ITableMembers, 'net_id' | 'user_id'> & {
  dislike_count: number;
};

export type IMemberVotes =
  Pick<T.ITableMembers, 'node_id'> & {
  vote_count: number;
};
