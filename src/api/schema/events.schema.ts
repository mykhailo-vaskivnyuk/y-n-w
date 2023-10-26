import Joi from 'joi';
import { NET_EVENT_MAP } from '../../client/common/server/types/types';
import { JOI_NULL } from '../../controller/constants';

export const EventsSchema = {
  event_id: Joi.number(),
  user_id: Joi.number(),
  net_id: [JOI_NULL, Joi.number()],
  net_view: [JOI_NULL, Joi.string()],
  from_node_id: [JOI_NULL, Joi.number()],
  event_type: Joi.string().custom((value, helpers) => {
    if (Object.keys(NET_EVENT_MAP).includes(value)) return value;
    return helpers.error('invalid event_type');
  }),
  message: Joi.string(),
  date: Joi.date(),
};
