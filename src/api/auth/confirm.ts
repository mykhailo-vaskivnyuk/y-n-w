import Joi from 'joi';
import { THandler } from '../../router/types';
import { ITableUsers } from '../../db/db.types';

type IConfirmParams = {
  link: string,
}

const confirm: THandler<IConfirmParams, ITableUsers> = async (context, { link }) => {
  const [user = null] = await execQuery.auth.getUserByLink([link]);
  if (!user) return null;
  await execQuery.auth.unsetUserLink([user.user_id]);
  return user;
};
confirm.params = {
  link: Joi.string(),
};

export = confirm;
