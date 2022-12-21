import { THandler } from '../../router/types';
import {
  ITokenParams, IUserResponse,
} from '../../client/common/api/types/types';
import { UserStateKeys } from '../../client/common/constants';
import {
  TokenParamsSchema, UserResponseSchema,
} from '../schema/schema';

const confirm: THandler<ITokenParams, IUserResponse> = async (
  { session }, { token },
) => {
  const [user] = await execQuery.user.findByToken([token]);
  if (!user) return null;
  const { user_id } = user;
  await execQuery.user.token.unset([user_id]);
  const user_state: UserStateKeys = 'LOGGEDIN';
  session.write('user_id', user_id);
  session.write('user_state', user_state);
  return { ...user, user_state };
};
confirm.paramsSchema = TokenParamsSchema;
confirm.responseSchema = UserResponseSchema;
confirm.allowedForUser = 'NOT_LOGGEDIN';

export = confirm;
