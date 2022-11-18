import {
  ILoginParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import { THandler } from '../../router/types';
import { UserStateKeys } from '../../client/common/constants';
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
  session.write('user_id', user_id);
  const user_state: UserStateKeys = confirm_token ?
    'NOT_CONFIRMED' :
    'LOGGEDIN';
  session.write('user_state', user_state);
  return { ...user, user_state };
};
login.paramsSchema = LoginParamsSchema;
login.responseSchema = UserResponseSchema;
login.allowedForUser = 'NOT_LOGGEDIN';

export = login;
