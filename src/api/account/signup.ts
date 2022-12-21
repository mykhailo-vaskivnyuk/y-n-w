import {
  ISignupParams, IUserResponse,
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
  const user_state = 'NOT_CONFIRMED';
  await execQuery.user.token.create([user_id, token]);
  await mailService.sendMail.confirm(email, origin, token);

  // const user_state = 'LOGGEDIN';
  // await execQuery.user.token.create([user_id, null]);

  session.write('user_id', user_id);
  session.write('user_state', user_state);
  return { ...user!, user_state };
};
signup.paramsSchema = SignupParamsSchema;
signup.responseSchema = UserResponseSchema;
signup.allowedForUser = 'NOT_LOGGEDIN';

export = signup;
