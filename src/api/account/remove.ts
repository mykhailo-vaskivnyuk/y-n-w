import Joi from 'joi';
import { THandler } from '../../router/types';
import { removeMember } from '../utils/utils';

const remove: THandler = async ({ session }) => {
  const event = 'LEAVE';
  const user_id = session.read('user_id')!;
  await removeMember(event, user_id);
  await execQuery.user.remove([user_id!]);
  await session.clear();
  return true;
};
remove.responseSchema = Joi.boolean();
remove.allowedForUser = 'NOT_CONFIRMED';

export = remove;
