import { OuterJoin } from '../../client/common/types';
import * as T from '../db.types';

export type IUserNet =
  T.ITableNodes &
  Pick<T.ITableNetsUsersData, 'confirmed'> &
  Pick<T.ITableNets, 'net_level'>;

export type IMember =
  T.ITableNodes &
  Pick<T.ITableNetsUsersData, 'user_id' | 'confirmed'>;

export type INodeWithUser =
  T.ITableNodes &
  OuterJoin<Pick<T.ITableUsersNodesInvites, 'token'>> &
  OuterJoin<Pick<T.ITableNetsUsersData, 'user_id' | 'confirmed'>>;

export type IMemberDislikes =
  Pick<T.ITableNetsUsersData, 'net_node_id' | 'user_id'> & {
  dislike_count: number;
};

export type IMemberVotes =
  Pick<T.ITableNetsUsersData, 'node_id'> & {
  vote_count: number;
};
