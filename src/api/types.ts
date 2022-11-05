import Joi from 'joi';
import { IUserResponse } from '../client/common/api/types';
import { TJoiSchema } from '../router/types';
import { OmitNull } from '../types/types';

export const UserResponseSchema = [
  Joi.any().equal(null),
  {
    email: Joi.string(),
    name: [Joi.string(), Joi.any().equal(null)],
    mobile: [Joi.string(), Joi.any().equal(null)],
    net_name: [Joi.string(), Joi.any().equal(null)],
    confirmed: Joi.boolean(),
  } as Record<keyof OmitNull<IUserResponse>, TJoiSchema>,
];

export const SignupParamsSchema = {
  email: Joi.string().required().email(),
};

export const ConfirmParamsSchema = {
  token: Joi.string(),
};
