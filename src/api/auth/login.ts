import Joi from 'joi';
import { ITableUsers } from '../../db/db.types';
import { THandler } from '../../router/types';

type ILoginParams = {
  email: string,
  password: string,
}

const login: THandler<ILoginParams, ITableUsers> = async (context, { email, password }) => {
  const [user = null] = await execQuery.auth.getUserIfExists([email, password]);
  if (!user) return null;
  await context.session.write('user_id', user.user_id);
  console.log('USER SET:', context.session.read('user_id'));
  return user;
};
login.params = {
  email: Joi.string().required(), //.email(),
  password: Joi.string().required(),
};


export = login;
