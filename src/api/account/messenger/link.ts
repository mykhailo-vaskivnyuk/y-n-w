import Joi from 'joi';
import { THandler } from '../../../router/types';
import { JOI_NULL } from '../../../router/constants';

export const get: THandler<never, string | null> =
  async ({ session }) => {
    const user_id = session.read('user_id')!;
    const token = cryptoService.createUnicCode(15);
    await execQuery.user.token.create([user_id, token]);
    return `tg://resolve?domain=u_n_w_bot&start=${token}`;
  };
get.responseSchema = [Joi.string(), JOI_NULL];

type TMessengerLinkConnectParams = {
  chatId: string;
  token: string;
}

export const connect: THandler<TMessengerLinkConnectParams, boolean> =
  async (_, { chatId, token }) => {
    const [user] = await execQuery.user.findByToken([token]);
    if (!user) return false;
    const { user_id } = user;
    await execQuery.user.token.remove([user_id]);
    await execQuery.user.messenger.connect([user_id, chatId]);
    return true;
  };
connect.paramsSchema = {
  chatId: Joi.string().required(),
  token: Joi.string().required(),
};
connect.responseSchema = Joi.boolean();
connect.allowedForUser = 'NOT_LOGGEDIN';
