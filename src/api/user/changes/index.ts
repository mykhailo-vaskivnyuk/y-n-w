import Joi from 'joi';
import {
  IUserChanges,
} from '../../../client/common/api/types/types';
import { THandler } from '../../../router/types';
import { UserChangesSchema } from '../../schema/schema';

export const read: THandler<{ date?: string }, IUserChanges> =
  async ({ session }, { date }) => {
    const user_id = session.read('user_id')!;
    const changes = await execQuery
      .user.changes.read([user_id, date || null]);
    logger.debug(changes);
    return changes;
  };
read.paramsSchema = {
  date: Joi.string(),
};
read.responseSchema = UserChangesSchema;

export const confirm: THandler<{ message_id: number }, boolean> =
  async ({ session }, { message_id }) => {
    const user_id = session.read('user_id')!;
    await execQuery.user.changes
      .confirm([user_id, message_id]);
    return true;
  };
confirm.paramsSchema = {
  message_id: Joi.number().required(),
};
confirm.responseSchema = Joi.boolean();
