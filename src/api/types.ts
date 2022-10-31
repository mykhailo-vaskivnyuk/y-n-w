import Joi from 'joi';
import { IUserResponse } from '../client/common/api/types';
import { JoiSchema } from '../router/types';

type OmitNull<T extends IUserResponse> = T extends null ? never : T;

export const UserResponseSchema = [
  Joi.any().equal(null),  
  {
    email: Joi.string(),
    name: [Joi.string(), Joi.any().equal(null)],
    mobile: [Joi.string(), Joi.any().equal(null)],
    net_name: [Joi.string(), Joi.any().equal(null)],
    confirmed: Joi.boolean(),
  } as Record<keyof OmitNull<IUserResponse>, JoiSchema>,
];
