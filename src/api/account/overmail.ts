import Joi from 'joi';
import { THandler } from '../../controller/types';
import { IEnterParams } from '../../client/common/server/types/types';
import { EnterParamsSchema } from '../schema/schema';

const overmail: THandler<IEnterParams, boolean> = async (
  _, { email },
) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return false;
  const token = cryptoService.createUnicCode(15);
  const { user_id, confirmed } = user;
  await execQuery.user.token.create([user_id, token]);
  const type = confirmed ? 'restore' : 'confirm';
  await mailService[type](email, token);
  return true;
};
overmail.paramsSchema = EnterParamsSchema;
overmail.responseSchema = Joi.boolean();
overmail.allowedForUser = 'NOT_LOGGEDIN';

export = overmail;
