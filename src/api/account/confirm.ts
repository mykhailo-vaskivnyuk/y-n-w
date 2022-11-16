import { THandler } from '../../router/types';
import {
  IConfirmParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import {
  ConfirmParamsSchema, UserResponseSchema,
} from '../schema/account.schema';

const confirm: THandler<IConfirmParams, IUserResponse> = async (
  { session }, { token },
) => {
  const [user] = await execQuery.user.findByToken([token]);
  if (!user) return null;
  const { user_id, confirm_token } = user;
  const confirmed = Boolean(confirm_token);
  await execQuery.user.unsetToken([user_id]);
  session.write('user_id', user_id);
  session.write('confirmed', confirmed);
  return { ...user, confirmed };
};
confirm.paramsSchema = ConfirmParamsSchema;
confirm.responseSchema = UserResponseSchema;

export = confirm;
