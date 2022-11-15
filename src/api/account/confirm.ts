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
  await execQuery.user.unsetToken([user_id]);
  await session.write('user_id', user_id);
  return { ...user, confirmed: !confirm_token };
};
confirm.paramsSchema = ConfirmParamsSchema;
confirm.responseSchema = UserResponseSchema;

export = confirm;
