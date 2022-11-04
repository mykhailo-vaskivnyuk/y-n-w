import { ISignupParams, IUserResponse } from '../../client/common/api/types';
import { THandler } from '../../router/types';
import { createHash, createUnicCode } from '../../utils/crypto';
import { SignupParamsSchema, UserResponseSchema } from '../types';

const signup: THandler<ISignupParams, IUserResponse> = async (
  { session, origin }, { email },
) => {
  let [user] = await execQuery.user.findUserByEmail([email]);
  if (user) return null;
  const hashedPassword = await createHash('12345');
  const token = createUnicCode(15);
  await execQuery.user.createUser([email, hashedPassword, token]);
  [user] = await execQuery.user.findUserByEmail([email]);
  if (!user) throw new Error('Unknown error');
  const { user_id, link } = user;
  session.write('user_id', user_id);
  await mailService.sendMail.confirm(email, origin, token);
  return { ...user, confirmed: !link};
};
signup.paramsSchema = SignupParamsSchema;
signup.responseSchema = UserResponseSchema;

export = signup;
