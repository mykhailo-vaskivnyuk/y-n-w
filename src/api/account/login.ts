import Joi from 'joi';
import { IUserResponse } from '../../client/common/api/types';
import { THandler } from '../../router/types';
import { verifyHash } from '../../utils/crypto';
import { UserResponseSchema } from '../types';

type ILoginParams = {
  email: string,
  password: string,
}

const login: THandler<ILoginParams, IUserResponse | null> = async (context, { email, password }) => {
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
login.responseSchema = UserResponseSchema;

export = login;
