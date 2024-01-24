import { IMemberResponse } from './types/types';
import { MemberStatusKeys } from './constants';

export const getMemberStatus = (
  member: Pick<IMemberResponse, 'count_of_members' | 'confirmed' | 'token'>,
): MemberStatusKeys => {
  const { count_of_members, confirmed, token } = member;
  if (confirmed === true) return 'ACTIVE';
  if (confirmed === false) return 'CONNECTED';
  if (count_of_members) return 'FREE';
  if (token) return 'INVITED';
  return 'EMPTY';
};
