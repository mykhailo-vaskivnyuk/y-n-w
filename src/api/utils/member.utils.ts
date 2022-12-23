import { MemberStatusKeys } from '../../client/common/api/types/types';
import { ITableNodes, ITableUsersNodesInvites } from '../../db/db.types';

export const getMemberStatus = (
  member: ITableUsersNodesInvites & ITableNodes,
) => {
  const { user_id, token } = member;
  let memberStatus: MemberStatusKeys = 'EMPTY';
  if (user_id) {
    if (token) memberStatus = 'CONNECTED';
    else memberStatus = 'ACTIVE';
  } else if (token) memberStatus = 'INVITED';
  return memberStatus;
};
