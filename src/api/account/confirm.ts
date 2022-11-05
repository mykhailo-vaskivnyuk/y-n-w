import { THandler } from '../../router/types';
import { IConfirmParams, IUserResponse } from '../../client/common/api/types';
import { ConfirmParamsSchema, UserResponseSchema } from '../types';

const confirm: THandler<IConfirmParams, IUserResponse> = async (
  { session }, { token },
) => {
  const [user] = await execQuery.user.findByLink([token]);
  if (!user) return null;
  const { user_id, link } = user;
  await execQuery.user.unsetLink([user_id]);
  await session.write('user_id', user_id);
  return { ...user, confirmed: !link };
};
confirm.paramsSchema = ConfirmParamsSchema;
confirm.responseSchema = UserResponseSchema;

export = confirm;
