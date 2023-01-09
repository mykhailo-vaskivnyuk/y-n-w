import Joi from 'joi';
import { THandler } from '../../router/types';
import { arrangeNodes, removeNetUser } from '../utils/net.utils';

const remove: THandler = async ({ session }) => {
  const user_id = session.read('user_id');
  await session.clear();
  const nodesToArrange = await removeNetUser(user_id!, null);
  await arrangeNodes(nodesToArrange);
  await execQuery.user.remove([user_id!]);
  return true;
};
remove.responseSchema = Joi.boolean();
remove.allowedForUser = 'NOT_CONFIRMED';

export = remove;
