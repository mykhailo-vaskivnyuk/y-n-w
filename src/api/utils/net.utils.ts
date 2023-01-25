/* eslint-disable max-lines */
import { UserStatusKeys } from '../../client/common/api/types/user.types';
import { IUserNetData, IUserNodeAndNetName } from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { HandlerError } from '../../router/errors';
import { updateCountOfMembers } from './nodes.utils';
import { excludeNullUndefined } from '../../utils/utils';
import { createMessages, createMessagesToConnected } from './messages.utils';

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

const removeConnected = async (
  event: NetEventKeys, memberNode: IUserNodeAndNetName, date: string,
) => {
  const { node_id } = memberNode;
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users)
    await removeConnectedMember(event, memberNode, user_id, date);
};

export const removeNetUser = async (
  user_id: number, net_node_id: number | null,
) => {
  const date = new Date().toUTCString();

  // 1 - get user's nodes in net and subnets
  const userNets = await execQuery.user.net
    .getNetAndSubnets([user_id, net_node_id]);

  // 2 - remove member_data from user and to user in net and subnets
  await execQuery.member.data.remove([user_id, net_node_id]);

  // 3 - remove connected users in net and subnets
  for (const userNet of userNets) {
    if (!userNet.confirmed) continue;
    await removeConnected('LEAVE', userNet, date);
  }

  // 4 - remove user from nodes in net and subnets
  await execQuery.member.remove([user_id, net_node_id]);

  // 5 - update nodes data in net and subnets
  for (const { node_id, confirmed } of userNets)
    confirmed && await updateCountOfMembers(node_id, -1);

  // 6 - create messages
  for (const userNet of userNets) await createMessages('LEAVE', userNet, date);

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
  const nodesToArrange = await removeNetUser(user_id, net_node_id);
  return nodesToArrange;
};

export const checkVotes = async (parent_node_id: number) => {
  const members = await execQuery.net.circle.getVotes([parent_node_id]);
  const count = members.length;
  if (!count) return null;
  const [memberWithMaxVotes] = members;
  const { vote_count } = memberWithMaxVotes!;
  const isVoted = vote_count === count;
  if (!isVoted) return;
  const { node_id } = memberWithMaxVotes!;
  await voteNetUser(node_id, parent_node_id);
};

export const voteNetUser = async (node_id: number, parent_node_id: number) => {
  const date = new Date().toUTCString();
  const [parent_member] = await execQuery.member.get([parent_node_id]);

  const { user_id: parentUserId = null } = parent_member || {};
  if (parent_member) {
    await removeConnected('VOTE', parent_member, date);
    await execQuery.member.data
      .removeFromCircle([parentUserId!, parent_node_id]);
  }

  const [member] = await execQuery.member.get([node_id]);
  const { user_id, net_node_id } = member!;
  await removeConnected('VOTE', member!, date);
  await execQuery.member.data.removeFromTree([user_id, node_id]);

  await execQuery.member.moveToTmp([node_id, parent_node_id]);
  await execQuery.member.removeVoted([node_id, parent_node_id]);
  await execQuery.member.change([
    node_id,
    parent_node_id,
    user_id,
    parentUserId,
    net_node_id,
  ]);
  await execQuery.member.moveFromTmp([node_id, parent_node_id]);
  await execQuery.member.removeFromTmp([node_id, parent_node_id]);
  !parentUserId && await execQuery.node.updateCountOfMembers([node_id, -1]);
};
