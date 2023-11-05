import * as T from './db.tables.types';

export type IMember = T.ITableNodes & T.ITableMembers;
export type IMemberNode = T.ITableNodes;
export type IMemberNet =
  IMember &
  T.ITableNets &
  T.ITableNetsData;

export type INodeWithUser =
  T.ITableNodes &
  T.OuterJoin<Pick<T.ITableMembersInvites, 'token'>> &
  T.OuterJoin<Pick<T.ITableMembers, 'user_id' | 'confirmed'>>;

export type IBranchDislikes =
  Pick<T.ITableMembers, 'member_id' | 'user_id'> &
  { dislike_count: number };

export type IBranchVotes =
  Pick<T.ITableNodes, 'node_id'> & {
  vote_count: number;
};
