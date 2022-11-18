import { THandler } from '../../router/types';
import {
  IConfirmParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import { UserStateKeys } from '../../client/common/constants';
import {
  ConfirmParamsSchema, UserResponseSchema,
} from '../schema/account.schema';

const confirm: THandler<IConfirmParams, IUserResponse> = async (
  { session }, { token },
) => {
  const [user] = await execQuery.user.findByToken([token]);
  if (!user) return null;
  const { user_id } = user;
  session.write('user_id', user_id);
  await execQuery.user.unsetToken([user_id]);
  const user_state: UserStateKeys = 'LOGGEDIN';
  session.write('user_state', user_state);
  return { ...user, user_state };
};
confirm.paramsSchema = ConfirmParamsSchema;
confirm.responseSchema = UserResponseSchema;
confirm.allowedForUser = 'NOT_LOGGEDIN';

export = confirm;
