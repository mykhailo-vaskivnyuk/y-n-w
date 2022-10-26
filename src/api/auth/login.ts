import Joi from 'joi';
import { ITableUsers } from '../../db/db.types';
import { THandler } from '../../router/types';
import { verifyHash } from '../../utils/crypto';

type ILoginParams = {
  email: string,
  password: string,
}

const login: THandler<ILoginParams, ITableUsers> = async (context, { email, password }) => {
  const [user = null] = await execQuery.user.findUserByEmail([email]);
  if (!user) return null;
  if (!user.password) return null;
  if (!await verifyHash(password, user.password)) return null;
  await context.session.write('user_id', user.user_id);
  return user;
};
login.params = {
  email: Joi.string().required(), //.email(),
  password: Joi.string().required(),
};


export = login;
