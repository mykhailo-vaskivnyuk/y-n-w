import Joi from 'joi';
import {
  IUserResponse, OmitNull,
} from '../../client/common/server/types/types';
import { TJoiSchema } from '../../controller/types';
import { JOI_NULL } from '../../controller/constants';

export const UserResponseSchema = [JOI_NULL, {
  user_id: Joi.number(),
  email: [Joi.string(), JOI_NULL],
  name: [Joi.string(), JOI_NULL],
  mobile: [Joi.string(), JOI_NULL],
  user_status: Joi.string(),
  chat_id: [Joi.string(), JOI_NULL],
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
