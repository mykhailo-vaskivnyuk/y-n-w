import Joi from 'joi';
import { ITableUsers } from '../../db/db.types';
import { THandler } from '../../router/types';
import { verifyHash } from '../../utils/crypto';

type ILoginParams = {
  email: string,
  password: string,
}

type ILoginResponse = Pick<ITableUsers, 'email' | 'name' | 'mobile' |'net_name'> & {
  email: string;
  name: string | null;
  mobile: string | null;
  net_name: string | null;
  confirmed: boolean;
}

const login: THandler<ILoginParams, ILoginResponse> = async (context, { email, password }) => {
  const [user] = await execQuery.user.findUserByEmail([email]);
  if (!user) return null;
  if (!user.password) return null;
  const isVerified = await verifyHash(password, user.password);
  if (!isVerified) return null;
  await context.session.write('user_id', user.user_id);
  return { ...user, confirmed: !user.link};
};
login.params = {
  email: Joi.string().required(), //.email(),
  password: Joi.string().required(),
};
login.response = {
  email: Joi.string(),
  name: Joi.string(),
  mobile: Joi.string(),
  net_name: Joi.string(),
  confirmed: Joi.boolean(),
};

export = login;
