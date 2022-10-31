import Joi from 'joi';
import { IUserResponse } from '../../client/common/api/types';
import { THandler } from '../../router/types';
import { createHash, createUnicCode } from '../../utils/crypto';
import { UserResponseSchema } from '../types';

type ISignupParams = {
  email: string,
}

const signup: THandler<ISignupParams, IUserResponse> = async (context, { email }) => {
  let [user] = await execQuery.user.findUserByEmail([email]);
  if (user) return null;
  const hashedPassword = await createHash('12345');
  const link = createUnicCode(15);
  await execQuery.user.createUser([email, hashedPassword, link]);
  [user] = await execQuery.user.findUserByEmail([email]);
  if (!user) throw new Error('Unknown error');
  context.session.write('user_id', user.user_id);
  await context.sendMail.confirm(email, link);
  return { ...user, confirmed: !user!.link};
};
signup.params = {
  email: Joi.string().required(), //.email(),
};
signup.responseSchema = UserResponseSchema;

export = signup;
