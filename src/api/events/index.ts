import Joi from 'joi';
import { IEvents } from '../../client/common/server/types/types';
import { THandler } from '../../router/types';
import { EventsSchema } from '../schema/schema';

export const read: THandler<{ date?: string }, IEvents> =
  async ({ session }, { date }) => {
    const user_id = session.read('user_id')!;
    const changes = await execQuery
      .events.read([user_id, date || null]);
    return changes;
  };
read.paramsSchema = {
  date: Joi.string(),
};
read.responseSchema = EventsSchema;

export const confirm: THandler<{ event_id: number }, boolean> =
  async ({ session }, { event_id }) => {
    const user_id = session.read('user_id')!;
    await execQuery
      .events.confirm([user_id, event_id]);
    return true;
  };
confirm.paramsSchema = {
  event_id: Joi.number().required(),
};
confirm.responseSchema = Joi.boolean();
