import Joi from 'joi';
import { IUserResponse } from '../../client/common/api/types/account.types';
import { TJoiSchema } from '../../router/types';
import { JOI_NULL } from '../../router/utils';
import { OmitNull } from '../../types/types';

export const UserResponseSchema = [
  JOI_NULL,
  {
    email: Joi.string(),
    name: [Joi.string(), JOI_NULL],
    mobile: [Joi.string(), JOI_NULL],
    net_name: [Joi.string(), JOI_NULL],
    user_state: Joi.string(),
  } as Record<keyof OmitNull<IUserResponse>, TJoiSchema>,
];

export const SignupParamsSchema = {
  email: Joi.string().required().email(),
};

export const LoginParamsSchema = {
  ...SignupParamsSchema,
  password: Joi.string().required(),
};

export const ConfirmParamsSchema = {
  token: Joi.string(),
};
