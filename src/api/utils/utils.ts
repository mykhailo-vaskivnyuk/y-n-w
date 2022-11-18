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

export const createTree = async (node: ITableNodes) => {
  const {
    node_level: parent_node_level,
    node_id: parent_node_id,
    first_node_id: parent_first_node_id,
  } = node;
  const node_level = parent_node_level + 1;
  const first_node_id = parent_first_node_id || parent_node_id;
  const date = new Date().toISOString();
  for (let node_position = 1; node_position <= 6; node_position++) {
    await execQuery.node.create([
      node_level,
      node_position,
      parent_node_id,
      first_node_id,
      date,
    ]);
  }
};
