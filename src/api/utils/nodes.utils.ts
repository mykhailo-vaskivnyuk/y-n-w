import { MAX_NODE_LEVEL } from '../../client/common/api/constants';
import { ITableNodes } from '../../db/db.types';
import { checkDislikes, checkVotes, updateCountOfNets } from './net.utils';

export const updateCountOfMembers = async (
  node_id: number, addCount = 1,
): Promise<void> => {
  const [node] = await execQuery.node.updateCountOfMembers([node_id, addCount]);
  const { parent_node_id } = node!;
  if (!parent_node_id) return;
  return await updateCountOfMembers(parent_node_id, addCount);
};

export const createTree = async (node: ITableNodes) => {
  const { node_level, node_id, net_node_id } = node;
  if (node_level >= MAX_NODE_LEVEL) return;
  await execQuery.node.createTree([node_level + 1, node_id, net_node_id]);
};

export const tightenNodes = async (node_id: number) => {
  const [node] = await execQuery.node.get([node_id]);
  if (!node) return false;
  const {
    user_id,
    confirmed,
    count_of_members,
    parent_node_id,
  } = node;
  if (user_id) return false;
  if (!confirmed) return false;
  if (!count_of_members) {
    await execQuery.node.removeTree([node_id]);
    if (parent_node_id) return true;
    await updateCountOfNets(node_id, -1);
    await execQuery.node.remove([node_id]);
    return true;
  }
  const [nodeWithMaxCount] = await execQuery.net.tree
    .getNodes([node_id]);
  if (!nodeWithMaxCount) return false;
  const {
    count_of_members: childCount,
    node_id: childNodeId } = nodeWithMaxCount;
  if (childCount !== count_of_members) return false;
  await execQuery.node.change([childNodeId, parent_node_id]);
  await execQuery.node.removeTree([node_id]);
  await execQuery.node.remove([node_id]);
  return true;
};

export const arrangeNodes = async (
  [...nodesToArrange]: number[] = [],
) => {
  while (nodesToArrange.length) {
    const node_id = nodesToArrange.shift();
    const isTighten = await tightenNodes(node_id!);
    if (isTighten) continue;
    const newNodesToArrange = await checkDislikes(node_id!);
    nodesToArrange = [...newNodesToArrange, ...nodesToArrange];
    await checkVotes(node_id!);
  }
};
