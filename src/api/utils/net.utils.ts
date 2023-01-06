/* eslint-disable max-lines */
import { ITableNodes } from '../../db/db.types';
import { HandlerError } from '../../router/errors';
import { updateCountOfMemebers } from './utils';

export const findUserNet = async (
  user_id: number, net_node_id: number,
) => {
  const [net = null] = await execQuery.user.net.find([user_id, net_node_id]);
  if (!net) throw new HandlerError('NOT_FOUND');
  const { token } = net;
  const userNetStatus = token ? 'INVITING' : 'INSIDE_NET';
  return [net, userNetStatus] as const;
};

export const removeNetUser = async (
  user_id: number, net_node_id: number | null,
) => {
  const nodes = await execQuery.user.net.getNodes([user_id, net_node_id]);
  await execQuery.net.nodes.removeUser([net_node_id, user_id]);
  await execQuery.user.members.removeInvites([user_id, net_node_id]);
  await execQuery.member.data.remove([user_id, net_node_id]);
  await execQuery.net.user.remove([net_node_id, user_id]);
  for (const node of nodes) await updateCountOfMemebers(node, -1);
  return nodes;
};

export const voteNetUser = async (node_id: number, parent_node_id: number) => {
  const [parent_user] = await execQuery.member.get([parent_node_id]);
  if (parent_user) {
    const { user_id, parent_node_id, net_node_id } = parent_user;
    await execQuery.user.members.removeInvites([net_node_id, user_id]);
    await execQuery.member.data.removeFromCircle([user_id, parent_node_id]);
  }
  const [user] = await execQuery.member.get([node_id]);
  const { user_id, net_node_id } = user!;
  await execQuery.user.members.removeInvites([net_node_id, user_id]);
  await execQuery.member.data.removeFromCircle([user_id, node_id]);
  await execQuery.member.change([
    node_id,
    parent_node_id,
    user_id,
    parent_user?.user_id || null,
    net_node_id,
  ]);
};

export const checkDislike = async (
  parent_node_id: number, nodesToArrange: ITableNodes[] = []
): Promise<ITableNodes[]> => {
  const members = await execQuery.net.circle.getDislikes([parent_node_id]);
  const count = members.length;
  if (!count) return nodesToArrange;
  const dislikedMember = members.find(({ dislike_count }) => Math.ceil(
    dislike_count / (count - dislike_count),
  ) > 1);
  if (!dislikedMember) return nodesToArrange;
  const { user_id, node_id } = dislikedMember;
  const newNodesToArrange = await removeNetUser(user_id, node_id);
  return await checkDislike(
    parent_node_id,
    [...nodesToArrange, ...newNodesToArrange],
  );
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

const tightenNodes = async (parent_node: ITableNodes) => {
  const { node_id } = parent_node;
  const [parentNode] = await execQuery.node.get([node_id]);
  const tree = await execQuery.net.tree.getNodes([node_id]);
  for (const node of tree) {
    const { count_of_members: count, node_id } = node;
    if (count === parentNode!.count_of_members) {
      await execQuery.node.change([node_id, parentNode!.parent_node_id]);
      await execQuery.node.removeTree([node_id]);
      await execQuery.node.remove([node_id]);
      return true;
    }
    if (count) return false;
  }
  // error
  return false;
};

export const arrangeNodes = async (nodesToArrange: ITableNodes[]) => {
  const parentNodes: ITableNodes[] = [];
  for (const { parent_node_id } of nodesToArrange) {
    if (!parent_node_id) continue;
    const [node] = await execQuery.node.get([parent_node_id]);
    parentNodes.push(node!);
  }
  let arrangeNodes = [...parentNodes, ...nodesToArrange];
  while (arrangeNodes.length) {
    const node = arrangeNodes.shift();
    const isTighten = await tightenNodes(node!);
    if (isTighten) continue;
    const newNodesToArrange = await checkDislike(node!.node_id);
    arrangeNodes = [...arrangeNodes, ...newNodesToArrange];
    await checkVotes(node!.node_id);
  }
};
