import { OuterJoin } from '../../client/common/types';
import {
  ITableNodes, ITableNetsUsersData, ITableUsersNodesInvites,
} from '../db.types';

export type INodeWithUser =
  ITableNodes &
  OuterJoin<Pick<ITableUsersNodesInvites, 'token'>> &
  OuterJoin<Pick<ITableNetsUsersData, 'user_id' | 'confirmed'>>;

export type IMemberDislikes =
  Pick<ITableNetsUsersData, 'net_node_id' | 'user_id'> & {
  dislike_count: number;
}

export type IMemberVotes =
  Pick<ITableNetsUsersData, 'node_id'> & {
  vote_count: number;
}
