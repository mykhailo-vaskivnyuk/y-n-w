import { ITableNodes } from '../../db/db.types';

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
  await execQuery.net.remove([node_id]);
  await execQuery.node.remove([node_id]);
};
