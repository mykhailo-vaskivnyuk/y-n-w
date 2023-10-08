/* eslint-disable max-lines */
import { IMember, IUserNetData } from '../../db/types/member.types';
import {
  NetEventKeys, UserStatusKeys,
} from '../../client/common/server/types/types';
import { ITableNetsData } from '../../db/types/db.tables.types';
import { ITransaction } from '../../db/types/types';
import { HandlerError } from '../../router/errors';
import { updateCountOfMembers } from './nodes.utils';
import { createMessagesToConnected } from './events/event.messages.other';
import { createEventMessages } from './events/event.messages.create';

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

export const removeConnected = async (
  event: NetEventKeys, memberNode: IMember, date: string
) => {
  const { node_id, net_id } = memberNode;
  const [netData] = await execQuery.net.data.get([net_id]);
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users)
    await removeConnectedMember(event, netData!, user_id, date);
};

export const removeMemberFromNet = async (
  event: NetEventKeys,
  userNetData: IUserNetData,
  date: string,
) => {
  const { user_id, net_id, node_id, parent_node_id, confirmed } = userNetData;
  logger.debug('START REMOVE FROM NET:', net_id);

  // 1 - remove events
  confirmed && await execQuery.events.removeFromNet([user_id, net_id]);

  // 2 - remove connected users in net and subnets
  confirmed && await removeConnected(event, userNetData, date);

  // 3 - remove member in net
  logger.debug('MEMBER REMOVE');
  await execQuery.member.remove([user_id, net_id]);

  // 4 - update nodes data in net
  confirmed && await updateCountOfMembers(node_id, -1);

  // 5 - create messages
  logger.debug('CREATE MESSAGES');
  if (confirmed) createEventMessages(event, userNetData, date);
  else createEventMessages('LEAVE_CONNECTED', userNetData, date);

  return [parent_node_id, node_id];
};
