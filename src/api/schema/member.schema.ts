import Joi from 'joi';
import { TJoiSchema } from '../../router/types';
import {
  IMemberConfirmParams,
  IMemberInviteParams,
} from '../../client/common/api/types/types';

export const MemberInviteParamsSchema = {
  node_id: Joi.number().required(),
  member_name: Joi.string().required(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;

export const MemberConfirmParamsSchema = {
  node_id: Joi.number().required(),
} as Record<keyof IMemberConfirmParams, TJoiSchema>;
