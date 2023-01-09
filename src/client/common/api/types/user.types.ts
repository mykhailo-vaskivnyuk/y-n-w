import {
  ITableNetsUsersData, ITableNodes, ITableUsersMembers,
} from '../../../local/imports';
import { DbRecordOrNull } from '../../types';

export const USER_STATUS_MAP = {
  'NOT_LOGGEDIN': 0,
  'NOT_CONFIRMED': 1,
  'LOGGEDIN': 2,
  'INVITING': 3,
  'INSIDE_NET': 4,
  'DEV': Infinity,
};
export type UserStatusKeys = keyof typeof USER_STATUS_MAP;
export type PartialUserStatusKeys = keyof Pick<typeof USER_STATUS_MAP,
  | 'NOT_LOGGEDIN'
  | 'NOT_CONFIRMED'>;
export const loggedInState = USER_STATUS_MAP.LOGGEDIN;

export type IUserNetDataResponse =
  Pick<ITableNodes, 'node_id' | 'parent_node_id'> &
  DbRecordOrNull<Pick<ITableNetsUsersData, 'confirmed'>> &
  DbRecordOrNull<Pick<ITableUsersMembers, 'vote'>> &
  { vote_count: number };
