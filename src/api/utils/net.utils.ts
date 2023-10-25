import { IUserNetData } from '../../db/types/member.types';
import { UserStatusKeys } from '../../client/common/server/types/types';
import { HandlerError } from '../../router/errors';
import { NetEvent } from '../../services/event/event';
import { Net } from '../../services/net/net';
import { exeWithNetLock } from './utils';

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

export const removeMemberFromNet = (event: NetEvent) =>
  exeWithNetLock(event.net_id, async (t) => {
    const net = new Net();
    const nodesToArrange =
      await net.removeMemberFromNetAndSubnets(event);
    await net.arrangeNodes(t, event, nodesToArrange);
    await event.commit(notificationService, t);
  });

export const removeMemberFromAllNets = async (user_id: number) => {
  const userNetDataArr = await execQuery.user.nets.getTop([user_id]);
  for (const userNetData of userNetDataArr) {
    const { net_id } = userNetData;
    const event = new NetEvent(net_id, 'LEAVE', userNetData);
    await removeMemberFromNet(event);
  }
};
