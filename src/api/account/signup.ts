import {
  ISignupParams, IUserResponse, UserStatusKeys,
} from '../../client/common/server/types/types';
import { THandler } from '../../router/types';
import {
  SignupParamsSchema, UserResponseSchema,
} from '../schema/schema';
import { createUnicCode } from '../../utils/crypto';

const signup: THandler<ISignupParams, IUserResponse> = async (
  { session, origin }, { email },
) => {
  const [userExists] = await execQuery.user.findByEmail([email]);
  if (userExists) return null;

  const token = createUnicCode(15);
  const [user] = await execQuery.user.create([email]);
  const { user_id } = user!;
  let user_status: UserStatusKeys;
  if (env.MAIL_CONFIRM_OFF) {
    user_status = 'LOGGEDIN';
    execQuery.user.confirm([user_id]);
  } else {
    user_status = 'NOT_CONFIRMED';
    await execQuery.user.token.create([user_id, token]);
    await mailService.sendMail.confirm(email, origin, token);
  }
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user!, user_status };
};
signup.paramsSchema = SignupParamsSchema;
signup.responseSchema = UserResponseSchema;
signup.allowedForUser = 'NOT_LOGGEDIN';

export = signup;
