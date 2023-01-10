/* eslint-disable max-lines */
import { UserStatusKeys } from '../../client/common/api/types/user.types';
import { ITableNodes } from '../../db/db.types';
import { HandlerError } from '../../router/errors';
import { IUserNet } from '../../router/types';
import { updateCountOfMembers } from './nodes.utils';

export const findUserNet = async (
  user_id: number, user_node_id: number,
): Promise<readonly [IUserNet, UserStatusKeys]> => {
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

const removeConnected = async (parent_node: ITableNodes) => {
  const { net_node_id, node_id } = parent_node;
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users)
    await refuseNetUser(user_id, net_node_id);
};

export const removeNetUser = async (
  user_id: number, net_node_id: number | null, userConfirmed = true,
) => {
  const nodes = await execQuery.user.net.getNodes([user_id, net_node_id]);
  await execQuery.member.data.remove([user_id, net_node_id]);
  if (userConfirmed) for (const node of nodes) await removeConnected(node);
  await execQuery.member.remove([user_id, net_node_id]);
  for (const { node_id, confirmed } of nodes)
    confirmed && await updateCountOfMembers(node_id, -1);
  const nodesToArrange = nodes.map(({ node_id }) => node_id);
  const { parent_node_id } = nodes[0]!;
  parent_node_id && nodesToArrange.unshift(parent_node_id);
  return nodesToArrange;
};

export const refuseNetUser = async (
  member_id: number, net_node_id: number,
) => {
  await execQuery.member.data.remove([member_id, net_node_id]);
  await execQuery.member.remove([member_id, net_node_id]);
};

export const checkDislikes = async (
  parent_node_id: number,
): Promise<number[]> => {
  const members = await execQuery.net.circle.getDislikes([parent_node_id]);
  const count = members.length;
  if (!count) return [];
  const memberWithMaxDislikes = members[0];
  const { dislike_count } = memberWithMaxDislikes!;
  const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
  if (!disliked) return [];
  const { user_id, node_id } = memberWithMaxDislikes!;
  const nodesToArrange = await removeNetUser(user_id, node_id);
  return nodesToArrange;
};

export const checkVotes = async (parent_node_id: number) => {
  const members = await execQuery.net.circle.getVotes([parent_node_id]);
  const count = members.length;
  if (!count) return null;
  const voteMember = members.find(({ vote_count }) => vote_count === count);
  if (!voteMember) return;
  const { node_id } = voteMember;
  await voteNetUser(node_id, parent_node_id);
};

export const voteNetUser = async (node_id: number, parent_node_id: number) => {
  const [parent_user] = await execQuery.member.get([parent_node_id]);
  if (parent_user) {
    const { user_id, parent_node_id } = parent_user;
    await removeConnected(parent_user);
    await execQuery.member.data.removeFromCircle([user_id, parent_node_id]);
  }
  const [user] = await execQuery.member.get([node_id]);
  const { user_id, net_node_id } = user!;
  await removeConnected(user!);
  await execQuery.member.data.removeFromTree([user_id, node_id]);
  await execQuery.member.moveToTmp([node_id, parent_node_id]);
  await execQuery.member.removeVoted([node_id, parent_node_id]);
  await execQuery.member.change([
    node_id,
    parent_node_id,
    user_id,
    parent_user?.user_id || null,
    net_node_id,
  ]);
  await execQuery.member.moveFromTmp([node_id, parent_node_id]);
  await execQuery.member.removeFromTmp([node_id, parent_node_id]);
};
