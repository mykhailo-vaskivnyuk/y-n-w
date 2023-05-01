/* eslint-disable max-lines */
import { IMember, IUserNetData } from '../../db/types/member.types';
import {
  NetEventKeys, UserStatusKeys,
} from '../../client/common/server/types/types';
import { HandlerError } from '../../router/errors';
import { updateCountOfMembers } from './nodes.utils';
import { excludeNullUndefined } from '../../utils/utils';
import { createMessagesToConnected } from './events/event.messages.other';
import { createEventMessages } from './events/event.messages.create';
import { ITableNetsData } from '../../db/types/db.tables.types';

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
  net_id: number, addCount = 1,
): Promise<void> => {
  const [net] = await execQuery.net.updateCountOfNets(
    [net_id, addCount],
  );
  const { parent_net_id } = net!;
  if (!parent_net_id) return;
  await updateCountOfNets(parent_net_id, addCount);
};

export const removeConnected = async (
  event: NetEventKeys, memberNode: IMember, date: string,
) => {
  const { node_id, net_id } = memberNode;
  const [netData] = await execQuery.net.data.get([net_id]);
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users)
    await removeConnectedMember(event, netData!, user_id, date);
};

export const removeNetUser = async (
  event: NetEventKeys,
  user_id: number,
  net_id: number | null,
) => {
  logger.debug('START REMOVE');
  const date = new Date().toUTCString();

  // 1 - get user's nodes in net and subnets
  const userNets = await execQuery
    .user.netData.getNetAndSubnets([user_id, net_id]);

  // 2 - remove events
  for (const userNet of userNets) {
    if (!userNet.confirmed) continue;
    await execQuery.events.removeFromNet([user_id, net_id]);
  }

  // 3 - remove connected users in net and subnets
  for (const userNet of userNets) {
    if (!userNet.confirmed) continue;
    await removeConnected(event, userNet, date);
  }

  // 4 - remove members in net and subnets
  logger.debug('USER REMOVE');
  await execQuery.member.remove([user_id, net_id]);

  // 5 - update nodes data in net and subnets
  for (const { node_id, confirmed } of userNets)
    confirmed && await updateCountOfMembers(node_id, -1);

  // 6 - create messages
  logger.debug('CREATE MESSAGES');
  for (const userNet of userNets) {
    if (userNet.confirmed) await createEventMessages(event, userNet, date);
    else await createEventMessages('LEAVE_CONNECTED', userNet, date);
  }

  const nodesToArrange = userNets.map(({ node_id: v }) => v);
  const parentNodesToArrange = userNets
    .map(({ parent_node_id: v }) => v)
    .filter(excludeNullUndefined);

  return [...parentNodesToArrange, ...nodesToArrange];
};

export const removeConnectedMember = async (
  event: NetEventKeys,
  netData: ITableNetsData,
  user_id: number,
  eventDate?: string,
) => {
  const { net_id } = netData;
  const date = eventDate || new Date().toUTCString();
  await execQuery.member.remove([user_id, net_id]);
  await createMessagesToConnected(event, netData, [user_id], date);
};
