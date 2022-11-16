import {
  ILoginParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import { THandler } from '../../router/types';
import {
  LoginParamsSchema, UserResponseSchema,
} from '../schema/account.schema';
import { verifyHash } from '../../utils/crypto';

const login: THandler<ILoginParams, IUserResponse> =
async ({ session }, { email, password }) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return null;
  if (!user.password) return null;
  const verified = await verifyHash(password, user.password);
  if (!verified) return null;
  const { user_id, confirm_token } = user;
  const confirmed = !confirm_token;
  session.write('user_id', user_id);
  session.write('confirmed', confirmed);
  return { ...user, confirmed };
};
login.paramsSchema = LoginParamsSchema;
login.responseSchema = UserResponseSchema;

export = login;
