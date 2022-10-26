import Joi from 'joi';
import { THandler } from '../../router/types';
import { ITableUsers } from '../../db/db.types';

type IRestoreParams = {
  link: string,
}

const Restore: THandler<IRestoreParams, ITableUsers> = async (context, { link }) => {
  const [user = null] = await execQuery.user.findByRestoreLink([link]);
  if (!user) return null;
  await execQuery.user.unsetUserLinks([user.user_id]);
  await context.session.write('user_id', user.user_id);
  return user;
};
Restore.params = {
  link: Joi.string(),
};

export = Restore;
