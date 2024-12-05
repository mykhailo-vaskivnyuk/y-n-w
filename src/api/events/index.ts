import Joi from 'joi';
import { IEvents } from '../../client/common/server/types/types';
import { THandler } from '../../controller/types';
import { EventsSchema } from '../schema/schema';

export const read: THandler<{ event_id?: number }, IEvents> = async (
  { session },
  { event_id = 0 },
) => {
  const user_id = session.read('user_id')!;
  const events = await execQuery.events.read([user_id, event_id]);
  await execQuery.user.events.clear([user_id]);
  return events;
};
read.paramsSchema = {
  event_id: Joi.number(),
};
read.responseSchema = EventsSchema;

export const confirm: THandler<{ event_id: number }, boolean> = async (
  { session },
  { event_id },
) => {
  const user_id = session.read('user_id')!;
  await execQuery.events.confirm([user_id, event_id]);
  return true;
};
confirm.paramsSchema = {
  event_id: Joi.number().required(),
};
confirm.responseSchema = Joi.boolean();
