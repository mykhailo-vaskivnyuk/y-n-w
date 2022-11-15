import {
  ILoginParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import { THandler } from '../../router/types';
import {
  LoginParamsSchema, UserResponseSchema,
} from '../schema/account.schema';
import { verifyHash } from '../../utils/crypto';

const login: THandler<ILoginParams, IUserResponse> =
async (context, { email, password }) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return null;
  if (!user.password) return null;
  const verified = await verifyHash(password, user.password);
  if (!verified) return null;
  const { user_id, confirm_token } = user;
  await context.session.write('user_id', user_id);
  return { ...user, confirmed: !confirm_token };
};
login.paramsSchema = LoginParamsSchema;
login.responseSchema = UserResponseSchema;

export = login;
