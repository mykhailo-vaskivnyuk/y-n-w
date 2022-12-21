import Joi from 'joi';
import {
  IMemberResponse, INetCreateParams, INetResponse,
} from '../../client/common/api/types/types';
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

export const NetsResponseSchema =
  NetResponseSchema[1] as Record<keyof OmitNull<INetResponse>, TJoiSchema>;

export const MemberResponseSchema = {
  node_id: Joi.number(),
  name: [Joi.string(), JOI_NULL],
  user_state: Joi.string(),
  member_name: [Joi.string(), JOI_NULL],
  token: [Joi.string(), JOI_NULL],
} as Record<keyof IMemberResponse, TJoiSchema>;

export const NetViewResponseSchema = { ...MemberResponseSchema };
