import { checkDislikes, checkVotes, updateCountOfNets } from './net.utils';

export const tightenNodes = async (node_id: number) => {
  const [node] = await execQuery.node.get([node_id]);
  if (!node) return false;
  const {
    user_id,
    count_of_members,
    parent_node_id,
    node_position,
  } = node;
  if (user_id) return false;
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
  await execQuery.node.change([childNodeId, parent_node_id, node_position]);
  await execQuery.node.removeTree([node_id]);
  if (!parent_node_id) {
    await execQuery.node.changeNetNode([childNodeId, node_id]);
    await execQuery.net.changeNetNode([childNodeId, node_id]);
    await execQuery.net.changeDataNetNode([childNodeId, node_id]);
  }
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
