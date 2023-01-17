import {
  ITableUsers, ITableUsersNodesInvites,
  ITableUsersMembers, ITableNetsUsersData, ITableNodes,
} from '../../../local/imports';
import { DbRecordOrNull } from '../../types';

export type IMemberInviteParams = {
  node_id: number;
  member_node_id: number;
  member_name: string;
};

export type IMemberConfirmParams = Omit<IMemberInviteParams, 'member_name'>;

export type IMemberResponse =
  Pick<ITableNodes, 'node_id' | 'count_of_members'> &
  DbRecordOrNull<Pick<ITableUsers, 'user_id' | 'name'>> &
  DbRecordOrNull<Pick<ITableNetsUsersData, 'confirmed'>> &
  DbRecordOrNull<Pick<ITableUsersNodesInvites, 'token' | 'member_name'>> &
  DbRecordOrNull<
    Omit<ITableUsersMembers, 'parent_node_id' | 'user_id' | 'member_id'>
  > &
  { vote_count: number };
