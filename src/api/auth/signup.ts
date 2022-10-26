import Joi from 'joi';
import { ITableUsers } from '../../db/db.types';
import { THandler } from '../../router/types';
import { createHash, createUnicCode } from '../../utils/crypto';

type ISignupParams = {
  email: string,
}

const signup: THandler<ISignupParams, ITableUsers> = async (context, { email }) => {
  let [user = null] = await execQuery.user.findUserByEmail([email]);
  if (user) return null;
  const hashedPassword = await createHash('12345');
  await execQuery.user.createUser([email, hashedPassword, createUnicCode(15)]);
  [user = null] = await execQuery.user.findUserByEmail([email]);
  user && context.session.write('user_id', user.user_id);
  const html = `link <a href='${context.origin}/#/confirm/${user!.link}>LINK TO CONFIRM EMAIL</a>`;
  await context.sendMail({ to: email, subject: 'Create account', html });
  return user;
};
signup.params = {
  email: Joi.string().required(), //.email(),
};

export = signup;
