import {
  ISignupParams, IUserResponse,
} from '../../client/common/api/types/account.types';
import { THandler } from '../../router/types';
import {
  SignupParamsSchema, UserResponseSchema,
} from '../schema/account.schema';
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
  session.write('user_id', user_id);
  const user_state = 'NOT_CONFIRMED';
  session.write('user_state', user_state);
  await execQuery.user.createTokens([user_id, token]);
  await mailService.sendMail.confirm(email, origin, token);
  return { ...user!, user_state };
};
signup.paramsSchema = SignupParamsSchema;
signup.responseSchema = UserResponseSchema;
signup.allowedForUser = 'NOT_LOGGEDIN';

export = signup;
