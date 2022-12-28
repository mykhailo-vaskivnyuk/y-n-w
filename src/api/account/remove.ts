import Joi from 'joi';
import { THandler } from '../../router/types';
import { updateCountOfMemebers } from '../utils/utils';

const remove: THandler = async ({ session }) => {
  const user_id = session.read('user_id');
  await session.clear();
  const nodes = await execQuery.user.net.getNodes([user_id!, null]);
  await execQuery.net.nodes.removeUser([null, user_id!]);
  await execQuery.user.remove([user_id!]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  return true;
};
remove.responseSchema = Joi.boolean();
remove.allowedForUser = 'NOT_CONFIRMED';

export = remove;
