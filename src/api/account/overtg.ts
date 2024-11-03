import Joi from 'joi';
import { THandler } from '../../controller/types';
import {
  IUserResponse, UserStatusKeys,
} from '../../client/common/server/types/types';
import { UserResponseSchema } from '../schema/schema';

const overtg: THandler<{ initData: string }, IUserResponse> = async (
  { session }, { initData },
) => {
  const tgUser = cryptoService.verifyTgData(initData);
  if (!tgUser) return null;
  const { id: chat_id } = tgUser;

  const [user] = await execQuery.user.findByChatId([chat_id]);
  if (!user) return null;

  const { user_id, confirmed } = user;
  const user_status: UserStatusKeys = confirmed ?
    'LOGGEDIN' :
    'NOT_CONFIRMED';
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user, user_status };
};
overtg.paramsSchema = { initData: Joi.string().required() };
overtg.responseSchema = UserResponseSchema;
overtg.allowedForUser = 'NOT_LOGGEDIN';

export = overtg;
