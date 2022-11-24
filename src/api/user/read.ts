import { IUserResponse } from '../../client/common/api/types/account.types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../schema/account.schema';

const read: THandler<never, IUserResponse> = async (context) => {
  const { session } = context;
  const user_id = session.read('user_id');
  if (!user_id) return null;
  const [user] = await execQuery.user.getById([user_id]);
  const user_state = session.read('user_state')!;
  return { ...user!, user_state };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGEDIN';

export = read;
