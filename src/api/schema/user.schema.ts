import Joi from 'joi';
import { IUserNetDataResponse } from '../../client/common/api/types/types';
import { TJoiSchema } from '../../router/types';
import { JOI_NULL } from '../../router/constants';

export const UserNetDataResponseSchema = {
  node_id: Joi.number(),
  parent_node_id: [Joi.number(), JOI_NULL],
  token: [Joi.string(), JOI_NULL],
  vote: [Joi.boolean(), JOI_NULL],
  vote_count: Joi.number(),
} as Record<keyof IUserNetDataResponse, TJoiSchema>;
