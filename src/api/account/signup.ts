import Joi from 'joi';
import { THandler } from '../../router/types';
import { createHash, createUnicCode } from '../../utils/crypto';
import { IUserResponse, UserResponseSchema } from '../types';

type ISignupParams = {
  email: string,
}

const signup: THandler<ISignupParams, IUserResponse> = async (context, { email }) => {
  let [user] = await execQuery.user.findUserByEmail([email]);
  if (user) return null;
  const hashedPassword = await createHash('12345');
  await execQuery.user.createUser([email, hashedPassword, createUnicCode(15)]);
  [user] = await execQuery.user.findUserByEmail([email]);
  if (!user) throw new Error('Unknown error');
  context.session.write('user_id', user.user_id);
  const html = `link <a href='${context.origin}/#/confirm/${user.link}>LINK TO CONFIRM EMAIL</a>`;
  await context.sendMail({ to: email, subject: 'Create account', html });
  return { ...user, confirmed: !user!.link};
};
signup.params = {
  email: Joi.string().required(), //.email(),
};
signup.responseSchema = UserResponseSchema;

export = signup;
