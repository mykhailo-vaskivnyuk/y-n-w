import Joi from 'joi';
import { ITableUsers } from '../db/db.types';

export type IUserResponse = null | Pick<ITableUsers, 'email' | 'name' | 'mobile' |'net_name'> & {
  email: string;
  name: string | null;
  mobile: string | null;
  net_name: string | null;
  confirmed: boolean;
}

export const UserResponseSchema = [
  Joi.any().equal(null),  
  {
    email: Joi.string(),
    name: [Joi.string(), Joi.any().equal(null)],
    mobile: [Joi.string(), Joi.any().equal(null)],
    net_name: [Joi.string(), Joi.any().equal(null)],
    confirmed: Joi.boolean(),
  },
];

console.log(Joi.object())