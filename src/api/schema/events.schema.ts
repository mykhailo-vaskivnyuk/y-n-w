import Joi from 'joi';
import { JOI_NULL } from '../../router/constants';

export const EventsSchema = {
  event_id: Joi.number(),
  user_id: Joi.number(),
  net_id: [JOI_NULL, Joi.number()],
  net_view: [JOI_NULL, Joi.string()],
  from_node_id: [JOI_NULL, Joi.number()],
  message: Joi.string(),
  date: Joi.date(),
};
