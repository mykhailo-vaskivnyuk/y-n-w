/* eslint-disable max-lines */
import { UserStatusKeys } from '../../client/common/api/types/user.types';
import { IUserNetData, IUserNodeAndNetName } from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { HandlerError } from '../../router/errors';
import { updateCountOfMembers } from './nodes.utils';
import { excludeNullUndefined } from '../../utils/utils';
import { createMessagesToConnected } from './messages.utils';
import { createMessages } from './messages.create.utils';

export const findUserNet = async (
  user_id: number, user_node_id: number,
): Promise<readonly [IUserNetData, UserStatusKeys]> => {
  const [userNet] = await execQuery.user.net.find([user_id, user_node_id]);
  if (!userNet) throw new HandlerError('NOT_FOUND');
  const { confirmed } = userNet;
  const userNetStatus = confirmed ? 'INSIDE_NET' : 'INVITING';
  return [userNet, userNetStatus];
};

export const updateCountOfNets = async (
  net_node_id: number, addCount = 1,
): Promise<void> => {
  const [net] = await execQuery.net.updateCountOfNets(
    [net_node_id, addCount],
  );
  const { parent_net_id } = net!;
  if (!parent_net_id) return;
  await updateCountOfNets(parent_net_id, addCount);
};

export const removeConnected = async (
  event: NetEventKeys, memberNode: IUserNodeAndNetName, date: string,
) => {
  const { node_id } = memberNode;
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users)
    await removeConnectedMember(event, memberNode, user_id, date);
};

export const removeNetUser = async (
  event: NetEventKeys,
  user_id: number,
  net_node_id: number | null,
) => {
  logger.debug('START REMOVE');
  const date = new Date().toUTCString();

  // 1 - get user's nodes in net and subnets
  const userNets = await execQuery.user.net
    .getNetAndSubnets([user_id, net_node_id]);

  // 2 - remove member_data from user and to user in net and subnets
  logger.debug('MEMBER DATA REMOVE');
  await execQuery.member.data.remove([user_id, net_node_id]);

  // 3 - remove connected users in net and subnets
  for (const userNet of userNets) {
    if (!userNet.confirmed) continue;
    await removeConnected(event, userNet, date);
  }

  // 4 - remove user from nodes in net and subnets
  logger.debug('USER REMOVE');
  await execQuery.member.remove([user_id, net_node_id]);

  // 5 - update nodes data in net and subnets
  for (const { node_id, confirmed } of userNets)
    confirmed && await updateCountOfMembers(node_id, -1);

  // 6 - create messages
  logger.debug('CREATE MESSAGES');
  for (const userNet of userNets) {
    if (userNet.confirmed) await createMessages(event, userNet, date);
    else await createMessages('LEAVE_CONNECTED', userNet, date);
  }

  const nodesToArrange = userNets.map(({ node_id: v }) => v);
  const parentNodesToArrange = userNets
    .map(({ parent_node_id: v }) => v)
    .filter(excludeNullUndefined);

  return [...parentNodesToArrange, ...nodesToArrange];
};

export const removeConnectedMember = async (
  event: NetEventKeys,
  memberNode: IUserNodeAndNetName,
  user_id: number,
  eventDate?: string,
) => {
  const { net_node_id } = memberNode;
  const date = eventDate || new Date().toUTCString();
  await execQuery.member.data.remove([user_id, net_node_id]);
  await execQuery.member.remove([user_id, net_node_id]);
  await createMessagesToConnected(event, memberNode, [user_id], date);
};

export const checkDislikes = async (
  parent_node_id: number,
): Promise<number[]> => {
  const members = await execQuery.net.circle.getDislikes([parent_node_id]);
  const count = members.length;
  if (!count) return [];
  const [memberWithMaxDislikes] = members;
  const { dislike_count } = memberWithMaxDislikes!;
  const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
  if (!disliked) return [];
  const { user_id, net_node_id } = memberWithMaxDislikes!;
  const nodesToArrange = await removeNetUser('DISLIKE', user_id, net_node_id);
  return nodesToArrange;
};
