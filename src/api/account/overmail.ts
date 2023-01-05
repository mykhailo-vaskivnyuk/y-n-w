import Joi from 'joi';
import { THandler } from '../../router/types';
import { ISignupParams } from '../../client/common/api/types/types';
import { SignupParamsSchema } from '../schema/schema';
import { createUnicCode } from '../../utils/crypto';

const overmail: THandler<ISignupParams, boolean> = async (
  { origin }, { email },
) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return false;
  const token = createUnicCode(15);
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
