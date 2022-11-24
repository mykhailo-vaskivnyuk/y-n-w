import { ITableNets, ITableNodes } from '../../db/db.types';

export const updateCountOfMemebers = async (
  node: ITableNodes, addCount = 1,
): Promise<void> => {
  const { node_id, parent_node_id, count_of_members } = node;
  if (!count_of_members) await execQuery.node.removeTree([node_id]);
  if (parent_node_id) {
    const [parent_node] = await execQuery.node.updateCountOfMembers(
      [parent_node_id, addCount],
    );
    return await updateCountOfMemebers(parent_node!);
  }
  if (count_of_members) return;
  const [net] = await execQuery.net.remove([node_id]);
  const { parent_net_id } = net!;
  parent_net_id && await execQuery.net.updateCountOfNets([parent_net_id, 1]);
  await execQuery.node.remove([node_id]);
};

export const updateCountOfNets = async (
  net: ITableNets, addCount = 1,
): Promise<void> => {
  const { parent_net_id } = net;
  if (!parent_net_id) return;
  const [parent_net] = await execQuery.net.updateCountOfNets(
    [parent_net_id, addCount],
  );
  return await updateCountOfNets(parent_net!);
};

export const createTree = async (node: ITableNodes) => {
  const { node_level, node_id, first_node_id, } = node;
  await execQuery.node.createTree([
    node_level + 1,
    node_id,
    first_node_id,
    new Date().toISOString(),
  ]);
};
