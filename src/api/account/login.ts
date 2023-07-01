import {
  ILoginParams, IUserResponse, UserStatusKeys,
} from '../../client/common/server/types/types';
import { THandler } from '../../router/types';
import {
  LoginParamsSchema, UserResponseSchema,
} from '../schema/schema';

const login: THandler<ILoginParams, IUserResponse> =
async ({ session }, { email, password }) => {
  const [user] = await execQuery.user.findByEmail([email]);
  if (!user) return null;
  const { user_id, password: savedPassword, confirmed } = user;
  if (!savedPassword) return null;
  const verified = await cryptoService.verifyHash(password, savedPassword);
  if (!verified) return null;
  const user_status: UserStatusKeys = confirmed ?
    'LOGGEDIN' :
    'NOT_CONFIRMED';
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user, user_status };
};
login.paramsSchema = LoginParamsSchema;
login.responseSchema = UserResponseSchema;
login.allowedForUser = 'NOT_LOGGEDIN';

export = login;
