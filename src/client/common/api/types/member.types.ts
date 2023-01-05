import {
  ITableUsers, ITableUsersNodesInvites,
  getEnumFromMap, ITableUsersMembers,
} from '../../../local/imports';
import { DbRecordOrNull } from '../../types';

export const MEMBER_STATUS_MAP = {
  UNAVAILABLE: 'unavailable',
  EMPTY: 'empty',
  INVITED: 'invited',
  CONNECTED: 'connected',
  ACTIVE: 'active',
};

export type MemberStatusKeys = keyof typeof MEMBER_STATUS_MAP;
export const MEMBER_STATUS_ENUM = getEnumFromMap(MEMBER_STATUS_MAP);

export type IMemberInviteParams = {
  net_node_id: number;
  node_id: number;
  member_name: string;
};

export type IMemberConfirmParams = Omit<IMemberInviteParams, 'member_name'>;

export type IMemberResponse = { node_id: number; vote_count: number } &
  Pick<ITableUsers, 'name'> &
  DbRecordOrNull<Omit<ITableUsersNodesInvites, 'node_id' | 'user_id'>> &
  DbRecordOrNull<
    Omit<ITableUsersMembers, 'parent_node_id' | 'user_id'| 'member_id'>
  >;

export type IMemberDislikes = {
  node_id: number;
  user_id: number;
  dislike_count: number;
};

export type IMemberVotes = {
  node_id: number;
  vote_count: number;
};
