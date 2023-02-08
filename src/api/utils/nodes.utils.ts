import { MAX_NODE_LEVEL } from '../../client/common/api/constants';
import { ITableNodes } from '../../db/db.types';

export const updateCountOfMembers = async (
  node_id: number, addCount = 1,
): Promise<void> => {
  const [node] = await execQuery.node.updateCountOfMembers([node_id, addCount]);
  const { parent_node_id, count_of_members } = node!;
  if (!count_of_members) await execQuery.node.removeTree([node_id]);
  if (!parent_node_id) return;
  return await updateCountOfMembers(parent_node_id, addCount);
};

export const createTree = async (node: ITableNodes) => {
  const { node_level, node_id, net_id } = node;
  if (node_level >= MAX_NODE_LEVEL) return;
  await execQuery.node.createTree([node_level + 1, node_id, net_id]);
};
