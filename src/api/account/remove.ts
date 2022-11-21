import Joi from 'joi';
import { THandler } from '../../router/types';
import { updateCountOfMemebers } from '../utils/utils';

const remove: THandler = async ({ session }) => {
  const user_id = await session.read('user_id');
  await session.clear();
  const nodes = await execQuery.nodes.user.remove([user_id!, 0]);
  await execQuery.user.remove([user_id]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  return true;
};
remove.responseSchema = Joi.boolean();
remove.allowedForUser = 'NOT_CONFIRMED';

export = remove;
