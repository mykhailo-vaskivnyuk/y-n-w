import { MemberStatusKeys } from '../../client/common/api/types/types';
import { DbRecordOrNull } from '../../client/common/types';
import {
  ITableNetsUsersData, ITableNodes, ITableUsersNodesInvites,
} from '../../db/db.types';

export const getMemberStatus = (member:
    ITableNodes &
    DbRecordOrNull<Pick<ITableNetsUsersData, 'confirmed'>> &
    DbRecordOrNull<Pick<ITableUsersNodesInvites, 'token'>>
): MemberStatusKeys => {
  const { count_of_members, confirmed, token } = member;
  if (confirmed === true) return 'ACTIVE';
  if (confirmed === false) return 'CONNECTED';
  if (token) return 'INVITED';
  if (count_of_members) return 'FREE';
  return 'EMPTY';
};
