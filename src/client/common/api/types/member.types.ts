import {
  ITableUsers, ITableUsersNodesInvites,
  getEnumFromMap, ITableUsersMembers, ITableNetsUsersData, ITableNodes,
} from '../../../local/imports';
import { DbRecordOrNull } from '../../types';

export const MEMBER_STATUS_MAP = {
  UNAVAILABLE: 'unavailable',
  EMPTY: 'empty',
  FREE: 'free',
  INVITED: 'invited',
  CONNECTED: 'connected',
  ACTIVE: 'active',
};

export type MemberStatusKeys = keyof typeof MEMBER_STATUS_MAP;
export const MEMBER_STATUS_ENUM = getEnumFromMap(MEMBER_STATUS_MAP);

export type IMemberInviteParams = {
  node_id: number;
  member_node_id: number;
  member_name: string;
};

export type IMemberConfirmParams = Omit<IMemberInviteParams, 'member_name'>;

export type IMemberResponse = { vote_count: number } &
  Pick<ITableNodes, 'node_id' | 'count_of_members'> &
  DbRecordOrNull<Pick<ITableUsers, 'name'>> &
  DbRecordOrNull<Pick<ITableNetsUsersData, 'confirmed'>> &
  DbRecordOrNull<Pick<ITableUsersNodesInvites, 'token' | 'member_name'>> &
  DbRecordOrNull<
    Omit<ITableUsersMembers, 'parent_node_id' | 'user_id'| 'member_id'>
  >;
