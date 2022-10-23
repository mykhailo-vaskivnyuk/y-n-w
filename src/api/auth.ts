import Joi from 'joi';
import { ITableUsers } from '../db/db.types';
import { THandler } from '../router/types';

type ILoginParams = {
  email: string,
  password: string,
}

const login: THandler<ILoginParams, ITableUsers> = async (context, { email, password }) => {
  const [user = null] = await execQuery.auth.getUserIfExists([email, password]);
  return user;
};
login.params = {
  email: Joi.string().required(), //.email(),
  password: Joi.string().required(),
};


export { login };
