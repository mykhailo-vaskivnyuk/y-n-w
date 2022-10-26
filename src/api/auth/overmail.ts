import Joi from 'joi';
import { THandler } from '../../router/types';
import { createUnicCode } from '../../utils/crypto';

type IOvermailParams = {
  email: string,
}

const overmail: THandler<IOvermailParams, boolean> = async (context, { email }) => {
  const [user = null] = await execQuery.user.findUserByEmail([email]);
  if (!user) return null;
  const restoreLink = createUnicCode(15);
  await execQuery.auth.setUserRestoreLink([user.user_id, restoreLink]);
  const html = `link <a href='http://localhost:8000/api/auth/confirm?restore=${user!.restore}&redirect=http://localhost:3000?'>LINK</a>`;
  await context.sendMail({ to: email, subject: 'Restore account', html });
  return true;
};
overmail.params = {
  email: Joi.string().required(), //.email(),
};

export = overmail;
