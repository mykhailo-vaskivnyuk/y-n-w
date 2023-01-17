import Joi from 'joi';
import {
  IMemberConfirmParams, IMemberInviteParams,
} from '../../client/common/api/types/types';
import { TJoiSchema } from '../../router/types';

export const MemberConfirmParamsSchema = {
  node_id: Joi.number(),
  member_node_id: Joi.number(),
} as Record<keyof IMemberConfirmParams, TJoiSchema>;

export const MemberInviteParamsSchema = {
  ...MemberConfirmParamsSchema,
  member_name: Joi.string(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;
