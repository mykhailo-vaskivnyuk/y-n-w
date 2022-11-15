import Joi from 'joi';
import { THandler } from '../../router/types';
import { ISignupParams } from '../../client/common/api/types/account.types';
import { SignupParamsSchema } from '../schema/account.schema';
import { createUnicCode } from '../../utils/crypto';

const overmail: THandler<ISignupParams, boolean> = async (
  { origin }, { email },
) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return false;
  const token = createUnicCode(15);
  const { user_id, link } = user;
  const params = link ?
    [user_id, token, null] as const :
    [user_id, null, token] as const;
  await execQuery.user.setLink([...params]);
  const type = link ? 'confirm' : 'restore';
  await mailService.sendMail[type](email, origin, token);
  return true;
};
overmail.paramsSchema = SignupParamsSchema;
overmail.responseSchema = Joi.boolean();

export = overmail;
