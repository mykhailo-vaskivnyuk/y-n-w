import { UserStatusKeys } from '../../client/common/api/types/types';
import { DbRecordOrNull } from '../../client/common/types';
import { ITableUsersNodesInvites } from '../../db/db.types';

export const findUserNet = async (
  user_id: number, net_id?: number | null,
) => {
  if (!net_id) return;
  const [net] = await execQuery.user.net.find([user_id, net_id]);
  return net;
};

export const getNetUserStatus = (
  invite?: DbRecordOrNull<ITableUsersNodesInvites>,
): UserStatusKeys => {
  if (!invite) return 'LOGGEDIN';
  return invite?.token ? 'INVITING' : 'INSIDE_NET';
};
