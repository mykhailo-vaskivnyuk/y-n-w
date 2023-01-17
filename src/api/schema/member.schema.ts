import Joi from 'joi';
import {
  IMemberConfirmParams, IMemberInviteParams,
} from '../../client/common/api/types/types';
import { TJoiSchema } from '../../router/types';

export const MemberConfirmParamsSchema = {
  node_id: Joi.number().required(),
  member_node_id: Joi.number().required(),
} as Record<keyof IMemberConfirmParams, TJoiSchema>;

export const MemberInviteParamsSchema = {
  ...MemberConfirmParamsSchema,
  member_name: Joi.string().required(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;
