/* eslint-disable max-lines */
import { IUserNetData } from '../../db/types/member.types';
import {
  UserStatusKeys,
} from '../../client/common/server/types/types';
import { ITableNetsData } from '../../db/types/db.tables.types';
import { ITransaction } from '../../db/types/types';
import { NetEvent } from '../../services/event/event';
import { HandlerError } from '../../router/errors';
import { updateCountOfMembers } from './nodes.utils';

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

export const updateCountOfNets = async (
  t: ITransaction, net_id: number, addCount = 1,
): Promise<void> => {
  const [net] = await t.execQuery.net.updateCountOfNets(
    [net_id, addCount],
  );
  const { parent_net_id } = net!;
  if (!parent_net_id) return;
  await updateCountOfNets(t, parent_net_id, addCount);
};

export const removeConnectedMember = async (
  event: NetEvent,
  netData: ITableNetsData,
  user_id: number,
) => {
  const { net_id } = netData;
  await execQuery.member.remove([user_id, net_id]);
  await event.messages.createToConnected(user_id);
};

export const removeConnectedAll = async (event: NetEvent) => {
  const { node_id, net_id } = event.member!;
  const [netData] = await execQuery.net.data.get([net_id]);
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users) {
    await removeConnectedMember(event, netData!, user_id);
  }
};

export const removeMemberFromNet = async (event: NetEvent) => {
  const { user_id, net_id, node_id, parent_node_id, confirmed } = event.member!;
  logger.debug('START REMOVE FROM NET:', net_id);

  // 1 - remove events
  confirmed && await execQuery.events.removeFromNet([user_id, net_id]);

  // 2 - remove connected users in net and subnets
  confirmed && await removeConnectedAll(event);

  // 3 - remove member in net
  logger.debug('MEMBER REMOVE');
  await execQuery.member.remove([user_id, net_id]);

  // 4 - update nodes data in net
  confirmed && await updateCountOfMembers(node_id, -1);

  // 5 - create messages
  logger.debug('CREATE MESSAGES');
  event.messages.create();

  return [parent_node_id, node_id];
};
