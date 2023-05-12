import { checkDislikes } from './dislike.utils';
import { updateCountOfNets } from './net.utils';
import { checkVotes } from './vote.utils';

const changeLevelFromNode = async (parentNodeId: number) => {
  for (let node_position = 0; node_position < 6; node_position++) {
    const [node] = await execQuery
      .node.getChild([parentNodeId, node_position]);
    const { node_id, count_of_members } = node!;
    await execQuery.node.changeLevel([node_id]);
    if (count_of_members) await changeLevelFromNode(node_id);
  }
};

export const tightenNodes = async (node_id: number) => {
  const [node] = await execQuery.node.getIfEmpty([node_id]);
  if (!node) return false;
  const {
    node_level,
    parent_node_id,
    net_id,
    node_position,
    count_of_members,
  } = node;
  if (!count_of_members) {
    if (parent_node_id) return true;
    await updateCountOfNets(net_id, -1);
    await execQuery.net.remove([net_id]);
    return true;
  }
  const [nodeWithMaxCount] = await execQuery.net.tree
    .getNodes([node_id]);
  if (!nodeWithMaxCount) return false;
  const {
    count_of_members: childCount,
    node_id: childNodeId } = nodeWithMaxCount;
  if (childCount !== count_of_members) return false;
  await execQuery.node.move([
    childNodeId, node_level, parent_node_id, node_position, count_of_members
  ]);
  if (parent_node_id) {
    changeLevelFromNode(childNodeId);
  } else {
    await execQuery.node.changeLevelAll([net_id]);
  }
  await execQuery.node.tree.remove([node_id]);
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
