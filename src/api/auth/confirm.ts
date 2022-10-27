import Joi from 'joi';
import { THandler } from '../../router/types';
import { ITableUsers } from '../../db/db.types';

type IConfirmParams = {
  link: string,
}

const confirm: THandler<IConfirmParams, ITableUsers> = async (context, { link }) => {
  const [user = null] = await execQuery.user.findByLink([link]);
  if (!user) return null;
  await execQuery.user.unsetUserLinks([user.user_id]);
  await context.session.write('user_id', user.user_id);
  return user;
};
confirm.params = {
  link: Joi.string(),
};

export = confirm;
