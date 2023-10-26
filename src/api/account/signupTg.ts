import Joi from 'joi';
import {
  IUserResponse,
} from '../../client/common/server/types/types';
import { THandler } from '../../controller/types';
import { UserResponseSchema } from '../schema/schema';

const signupTg: THandler<{ initData: string }, IUserResponse> = async (
  { session }, { initData },
) => {
  const chat_id = cryptoService.verifyTgData(initData);
  if (!chat_id) return null;

  const [userExists] = await execQuery.user.findByChatId([chat_id]);
  if (userExists) return null;

  const [user] = await execQuery.user.createByChatId([chat_id]);
  const { user_id } = user!;
  const user_status = 'LOGGEDIN';
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user!, user_status };
};
signupTg.paramsSchema = { initData: Joi.string().required() };
signupTg.responseSchema = UserResponseSchema;
signupTg.allowedForUser = 'NOT_LOGGEDIN';

export = signupTg;
