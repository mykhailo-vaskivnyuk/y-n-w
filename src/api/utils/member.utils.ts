import { MemberStatusKeys } from '../../client/common/api/types/types';
import { INodeWithUser } from '../../db/types/types';

export const getMemberStatus = (member: INodeWithUser): MemberStatusKeys => {
  const { count_of_members, confirmed, token } = member;
  if (confirmed === true) return 'ACTIVE';
  if (confirmed === false) return 'CONNECTED';
  if (token) return 'INVITED';
  if (count_of_members) return 'FREE';
  return 'EMPTY';
};
