import Joi from 'joi';
import { TJoiSchema } from '../../router/types';
import {
  IMemberInviteParams,
} from '../../client/common/api/types/types';

export const MemberInviteParamsSchema = {
  node_id: Joi.number().required(),
  member_name: Joi.string().required(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;
