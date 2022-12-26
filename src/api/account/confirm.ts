import { THandler } from '../../router/types';
import {
  ITokenParams, IUserResponse,
} from '../../client/common/api/types/types';
import { UserStatusKeys } from '../../client/common/constants';
import {
  TokenParamsSchema, UserResponseSchema,
} from '../schema/schema';

const confirm: THandler<ITokenParams, IUserResponse> = async (
  { session }, { token },
) => {
  const [user] = await execQuery.user.findByToken([token]);
  if (!user) return null;
  const { user_id } = user;
  await execQuery.user.token.remove([user_id]);
  const user_status: UserStatusKeys = 'LOGGEDIN';
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user, user_status };
};
confirm.paramsSchema = TokenParamsSchema;
confirm.responseSchema = UserResponseSchema;
confirm.allowedForUser = 'NOT_LOGGEDIN';

export = confirm;
