import Joi from 'joi';
import { TJoiSchema } from '../../router/types';
import {
  IMemberConfirmParams, IMemberInviteParams,
} from '../../client/common/api/types/types';

export const MemberConfirmParamsSchema = {
  net_id: Joi.number().required(),
  node_id: Joi.number().required(),
} as Record<keyof IMemberConfirmParams, TJoiSchema>;

export const MemberInviteParamsSchema = {
  ...MemberConfirmParamsSchema,
  member_name: Joi.string().required(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;
