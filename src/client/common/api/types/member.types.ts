import {
  ITableUsers, ITableUsersNodesInvites,
  ITableUsersMembers, ITableNetsUsersData, ITableNodes,
} from '../../../local/imports';
import { OuterJoin } from '../../types';

export type IMemberInviteParams = {
  node_id: number;
  member_node_id: number;
  member_name: string;
};

export type IMemberConfirmParams = Omit<IMemberInviteParams, 'member_name'>;

export type IMemberResponse =
  Pick<ITableNodes, 'node_id' | 'count_of_members'> &
  OuterJoin<Pick<ITableUsers, 'user_id' | 'name'>> &
  OuterJoin<Pick<ITableNetsUsersData, 'confirmed'>> &
  OuterJoin<Pick<ITableUsersNodesInvites, 'token' | 'member_name'>> &
  OuterJoin<
    Omit<ITableUsersMembers, 'parent_node_id' | 'user_id' | 'member_id'>
  > &
  { vote_count: number };
