import Joi from 'joi';
import { THandler } from '../../router/types';
import { createUnicCode } from '../../utils/crypto';

type IOvermailParams = {
  email: string,
}

const overmail: THandler<IOvermailParams, boolean> = async (context, { email }) => {
  const [user] = await execQuery.user.findUserByEmail([email]);
  if (!user) return false;
  const token = createUnicCode(15);
  const { user_id, link } = user;
  const params = link
    ? [user_id, token, null] as const
    : [user_id, null, token] as const;
  await execQuery.user.setLink([...params]);
  const type = link ? 'confirm' : 'restore';
  await context.sendMail[type](email, token);
  return true;
};
overmail.paramsSchema = {
  email: Joi.string().required(), //.email(),
};
overmail.responseSchema = Joi.boolean();

export = overmail;
