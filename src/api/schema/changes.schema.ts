import Joi from 'joi';
import { JOI_NULL } from '../../router/constants';

export const UserChangesSchema = {
  message_id: Joi.number(),
  user_id: Joi.number(),
  user_node_id: [JOI_NULL, Joi.number()],
  net_view: Joi.string(),
  member_node_id: [JOI_NULL, Joi.number()],
  message: Joi.string(),
  date: Joi.date(),
};
