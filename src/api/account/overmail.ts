import Joi from 'joi';
import { THandler } from '../../router/types';
import { createUnicCode } from '../../utils/crypto';

type IOvermailParams = {
  email: string,
}

const overmail: THandler<IOvermailParams, boolean> = async (context, { email }) => {
  const [user = null] = await execQuery.user.findUserByEmail([email]);
  if (!user) return false;
  const restore = createUnicCode(15);
  const { link } = user;
  link
    ? await execQuery.user.setLink([user.user_id, restore])
    : await execQuery.user.setRestoreLink([user.user_id, restore]);
  const html = `link <a href='${context.origin}/#/${link ? 'confirm' : 'restore'}/${restore}>LINK TO CONFIRM EMAIL</a>`;
  await context.sendMail({ to: email, subject: 'Restore account', html });
  return true;
};
overmail.params = {
  email: Joi.string().required(), //.email(),
};

export = overmail;
