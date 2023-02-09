import { IUserResponse } from '../../client/common/server/types/types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../schema/schema';

const read: THandler<never, IUserResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  const user_status = session.read('user_status')!;
  if (!user_id) return null;
  const [user] = await execQuery.user.getById([user_id]);
  return { ...user!, user_status };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGEDIN';

export = read;
