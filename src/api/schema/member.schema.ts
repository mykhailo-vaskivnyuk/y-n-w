import Joi from 'joi';
import {
  IMemberConfirmParams,
  IMemberInviteParams,
} from '../../client/common/server/types/types';
import { TJoiSchema } from '../../controller/types';

export const MemberConfirmParamsSchema = {
  node_id: Joi.number().required(),
  member_node_id: Joi.number().required(),
} as Record<keyof IMemberConfirmParams, TJoiSchema>;

export const MemberInviteParamsSchema = {
  ...MemberConfirmParamsSchema,
  member_name: Joi.string().required(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;
