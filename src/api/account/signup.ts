import {
  ISignupParams, IUserResponse, UserStatusKeys,
} from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import {
  SignupParamsSchema, UserResponseSchema,
} from '../schema/schema';
import { createHash, createUnicCode } from '../../utils/crypto';

const signup: THandler<ISignupParams, IUserResponse> = async (
  { session, origin }, { email },
) => {
  const [userExists] = await execQuery.user.findByEmail([email]);
  if (userExists) return null;
  const hashedPassword = await createHash('12345');
  const token = createUnicCode(15);
  const [user] = await execQuery.user.create([email, hashedPassword]);
  const { user_id } = user!;
  let user_status: UserStatusKeys = 'NOT_CONFIRMED';
  if (env.MAIL_CONFIRM_OFF) user_status = 'LOGGEDIN';
  else {
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
