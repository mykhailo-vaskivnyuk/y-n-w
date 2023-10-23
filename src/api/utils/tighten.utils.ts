import { ITransaction } from '../../db/types/types';

const changeLevelFromNode = async (parentNodeId: number) => {
  for (let node_position = 0; node_position < 6; node_position++) {
    const [node] = await execQuery
      .node.getChild([parentNodeId, node_position]);
    const { node_id, count_of_members } = node!;
    await execQuery.node.changeLevel([node_id]);
    if (count_of_members) await changeLevelFromNode(node_id);
  }
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

export const tightenNodes = async (t: ITransaction, node_id: number) => {
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
    await execQuery.node.remove([node_id]);
    await updateCountOfNets(t, net_id, -1);
    await t.execQuery.net.remove([net_id]);
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
