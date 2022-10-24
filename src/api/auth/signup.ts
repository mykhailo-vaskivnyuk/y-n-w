import Joi from 'joi';
import { ITableUsers } from '../../db/db.types';
import { THandler } from '../../router/types';
import { createUnicCode } from '../../utils/utils';

type ISignupParams = {
  email: string,
}

const signup: THandler<ISignupParams, ITableUsers> = async (context, { email }) => {
  let [user = null] = await execQuery.auth.getUserByEmail([email]);
  if (user) return null;
  await execQuery.auth.createUserIfNotExists([email, createUnicCode(15)]);
  [user = null] = await execQuery.auth.getUserByEmail([email]);
  user && context.session.write('user_id', user.user_id);
  const html = `link <a href='http://localhost:8000/api/auth/confirm?link=${user!.link}&redirect=http://localhost:3000'>LINK</a>`;
  await context.sendMail({ to: email, subject: 'Create account', html });
  return user;
};
signup.params = {
  email: Joi.string().required(), //.email(),
  // password: Joi.string().required(),
};


export = signup;
