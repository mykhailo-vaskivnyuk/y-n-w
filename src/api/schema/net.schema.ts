import Joi from 'joi';
import {
  INetCreateParams, INetResponse,
} from '../../client/common/api/types/net.types';
import { TJoiSchema } from '../../router/types';
import { OmitNull } from '../../client/common/types';
import { JOI_NULL } from '../../router/constants';


export const NetCreateParamsSchema = {
  name: Joi.string().required(),
} as Record<keyof INetCreateParams, TJoiSchema>;

export const NetResponseSchema = [
  JOI_NULL,
  {
    net_id: Joi.number(),
    net_level: Joi.number(),
    parent_net_id: [Joi.number(), JOI_NULL],
    first_net_id: Joi.number(),
    count_of_nets: Joi.number(),
    name: Joi.string(),
  } as Record<keyof OmitNull<INetResponse>, TJoiSchema>,
];

export const NetReadParamsSchema = {
  net_id: [JOI_NULL, Joi.number().required()],
};

export const NetSimpleResponseSchema = {
  net_id: Joi.number(),
  name: Joi.string(),
};
