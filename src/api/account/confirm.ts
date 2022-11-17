import { THandler } from '../../router/types';
import {
  IConfirmParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import {
  ConfirmParamsSchema, UserResponseSchema,
} from '../schema/account.schema';
import { UserStateKeys } from '../../client/common/constants';

const confirm: THandler<IConfirmParams, IUserResponse> = async (
  { session }, { token },
) => {
  const [user] = await execQuery.user.findByToken([token]);
  if (!user) return null;
  const { user_id } = user;
  const user_state: UserStateKeys = 'LOGGEDIN';
  await execQuery.user.unsetToken([user_id]);
  session.write('user_id', user_id);
  session.write('user_state', user_state);
  return { ...user, user_state };
};
confirm.paramsSchema = ConfirmParamsSchema;
confirm.responseSchema = UserResponseSchema;
confirm.allowedForUser = 'NOT_LOGGEDIN';

export = confirm;
