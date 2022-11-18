import Joi from 'joi';
import { ITableNodes } from '../../db/db.types';
import { THandler } from '../../router/types';

const updateCountOfMemebers = async (
  node: ITableNodes, addCount = 1,
): Promise<void> => {
  const { parent_node_id } = node;
  if (!parent_node_id) return;
  const [parent_node] = await execQuery.node.updateCountOfMembers(
    [parent_node_id, addCount],
  );
  const { node_id, count_of_members } = parent_node!;
  if (count_of_members) return await updateCountOfMemebers(parent_node!);
  await execQuery.node.removeTree([node_id]);
  if (parent_node!.parent_node_id) return;
  await execQuery.net.remove([node_id]);
  await execQuery.node.remove([node_id]);
};

const remove: THandler = async (context) => {
  const user_id = await context.session.read('user_id');
  if (!user_id) return false;
  await context.session.clear();
  const nodes = await execQuery.node.removeUser([user_id]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  await execQuery.user.remove([user_id]);
  return true;
};
remove.responseSchema = Joi.boolean();
remove.allowedForUser = 'NOT_CONFIRMED';

export = remove;
