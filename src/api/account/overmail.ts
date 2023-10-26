import Joi from 'joi';
import { THandler } from '../../controller/types';
import { ISignupParams } from '../../client/common/server/types/types';
import { SignupParamsSchema } from '../schema/schema';

const overmail: THandler<ISignupParams, boolean> = async (
  { origin }, { email },
) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return false;
  const token = cryptoService.createUnicCode(15);
  const { user_id, confirmed } = user;
  await execQuery.user.token.create([user_id, token]);
  const type = confirmed ? 'restore' : 'confirm';
  await mailService.sendMail[type](email, origin, token);
  return true;
};
overmail.paramsSchema = SignupParamsSchema;
overmail.responseSchema = Joi.boolean();
overmail.allowedForUser = 'NOT_LOGGEDIN';

export = overmail;
