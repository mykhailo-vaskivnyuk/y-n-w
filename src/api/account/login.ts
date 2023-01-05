import {
  ILoginParams, IUserResponse, UserStatusKeys,
} from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import {
  LoginParamsSchema, UserResponseSchema,
} from '../schema/schema';
import { verifyHash } from '../../utils/crypto';

const login: THandler<ILoginParams, IUserResponse> =
async ({ session }, { email, password }) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return null;
  if (!user.password) return null;
  const verified = await verifyHash(password, user.password);
  if (!verified) return null;
  const { user_id, token } = user;
  const user_status: UserStatusKeys = token ?
    'NOT_CONFIRMED' :
    'LOGGEDIN';
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user, user_status };
};
login.paramsSchema = LoginParamsSchema;
login.responseSchema = UserResponseSchema;
login.allowedForUser = 'NOT_LOGGEDIN';

export = login;
