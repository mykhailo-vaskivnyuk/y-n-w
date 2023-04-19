import Joi from 'joi';
import {
  IUserResponse, OmitNull,
} from '../../client/common/server/types/types';
import { TJoiSchema } from '../../router/types';
import { JOI_NULL } from '../../router/constants';

export const UserResponseSchema = [JOI_NULL, {
  user_id: Joi.number(),
  email: Joi.string(),
  name: [Joi.string(), JOI_NULL],
  mobile: [Joi.string(), JOI_NULL],
  user_status: Joi.string(),
} as Record<keyof OmitNull<IUserResponse>, TJoiSchema>];

export const SignupParamsSchema = {
  email: Joi.string().required().email(),
};

export const LoginParamsSchema = {
  ...SignupParamsSchema,
  password: Joi.string().required(),
};

export const UserUpdateParamsSchema = {
  name: Joi.string().empty(''),
  mobile: Joi.string().empty(''),
  password: Joi.string().empty(''),
};
