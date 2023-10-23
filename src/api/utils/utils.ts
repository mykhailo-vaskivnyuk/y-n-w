import { UserStatusKeys } from '../../client/common/server/types/types';
import { IUserNetData } from '../../db/types/member.types';
import { ITransaction } from '../../db/types/types';
import { HandlerError } from '../../router/errors';

export const exeWithNetLock = async <T>(
  net_id: number | null,
  func: (t: ITransaction) => T,
) => {
  const t = await startTransaction();
  try {
    if (net_id) await t.execQuery.net.lock([net_id]);
    const result = await func(t);
    await t.commit();
    return result;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export const findUserNet = async (
  user_id: number, user_node_id: number,
): Promise<readonly [IUserNetData, UserStatusKeys]> => {
  const [userNet] = await execQuery
    .user.netData.findByNode([user_id, user_node_id]);
  if (!userNet) throw new HandlerError('NOT_FOUND');
  const { confirmed } = userNet;
  const userNetStatus = confirmed ? 'INSIDE_NET' : 'INVITING';
  return [userNet, userNetStatus];
};
