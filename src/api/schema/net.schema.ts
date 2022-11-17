import Joi from 'joi';
import {
  INetCreateParams, INetCreateResponse,
} from '../../client/common/api/types/net.types';
import { TJoiSchema } from '../../router/types';
import { JOI_NULL } from '../../router/utils';

export const NetCreateParamsSchema = {
  name: Joi.string().required(),
} as Record<keyof INetCreateParams, TJoiSchema>;

export const NetCreateResponseSchema = {
  net_id: Joi.number(),
  net_level: Joi.number(),
  parent_net_id: [Joi.number(), JOI_NULL],
  first_net_id: [Joi.number(), JOI_NULL],
  count_of_nets: Joi.number(),
  name: Joi.string(),
} as Record<keyof INetCreateResponse, TJoiSchema>;
