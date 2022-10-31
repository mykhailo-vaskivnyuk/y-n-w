import Joi from 'joi';
import { IUserResponse } from '../../client/common/api/types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../types';

type IConfirmParams = {
  link: string,
}

const confirm: THandler<IConfirmParams, IUserResponse | null> = async (context, { link }) => {
  const [user] = await execQuery.user.findByLink([link]);
  if (!user) return null;
  await execQuery.user.unsetLink([user.user_id]);
  await context.session.write('user_id', user.user_id);
  return { ...user, confirmed: !user.link};
};
confirm.params = {
  link: Joi.string(),
};
confirm.responseSchema = UserResponseSchema;

export = confirm;
