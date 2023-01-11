import Joi from 'joi';
import {
  IMemberResponse, INetCreateParams, INetResponse,
} from '../../client/common/api/types/types';
import { TJoiSchema } from '../../router/types';
import { OmitNull } from '../../client/common/types';
import { JOI_NULL } from '../../router/constants';

export const NetEnterParamsSchema = { net_node_id: Joi.number().required() };
export const NetReadParamsSchema = { node_id: Joi.number().required() };

export const NetCreateParamsSchema = {
  node_id: [Joi.number(), JOI_NULL],
  name: Joi.string().required(),
} as Record<keyof INetCreateParams, TJoiSchema>;

export const NetResponseSchema = [JOI_NULL,
  {
    net_node_id: Joi.number(),
    net_level: Joi.number(),
    parent_net_id: [Joi.number(), JOI_NULL],
    first_net_id: Joi.number(),
    count_of_nets: Joi.number(),
    name: Joi.string(),
    node_id: Joi.number(),
  } as Record<keyof OmitNull<INetResponse>, TJoiSchema>,
];

export const NetsResponseSchema =
  NetResponseSchema[1] as Record<keyof OmitNull<INetResponse>, TJoiSchema>;

export const MemberResponseSchema = {
  node_id: Joi.number().required(),
  count_of_members: Joi.number().required(),
  name: [Joi.string(), JOI_NULL],
  confirmed: [Joi.boolean(), JOI_NULL],
  token: [Joi.string(), JOI_NULL],
  member_name: [Joi.string(), JOI_NULL],
  dislike: [Joi.boolean(), JOI_NULL],
  vote: [Joi.boolean(), JOI_NULL],
  vote_count: Joi.number(),
} as Record<keyof IMemberResponse, TJoiSchema>;

export const NetViewResponseSchema = { ...MemberResponseSchema };
