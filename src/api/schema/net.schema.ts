import Joi from 'joi';
import {
  INetCreateParams, INetCreateResponse,
} from '../../client/common/api/types/net.types';
import { TJoiSchema } from '../../router/types';

export const NetCreateParamsSchema = {
  net_level: [Joi.number().integer(), Joi.any().equal()],
  parent_net_id: [Joi.number().integer(), Joi.any().equal()],
  first_net_id: [Joi.number().integer(), Joi.any().equal()],
  count_of_nets: [Joi.number().integer(), Joi.any().equal()],
  name: Joi.string().required(),
} as Record<keyof INetCreateParams, TJoiSchema>;

export const NetCreateResponse = {
  net_id: Joi.number(),
  net_level: Joi.number(),
  parent_net_id: [Joi.number(), Joi.any().equal(null)],
  first_net_id: [Joi.number(), Joi.any().equal(null)],
  count_of_nets: Joi.number(),
  name: Joi.string(),
} as Record<keyof INetCreateResponse, TJoiSchema>;
