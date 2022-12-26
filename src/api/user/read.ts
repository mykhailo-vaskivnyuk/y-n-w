import { IUserResponse } from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../schema/schema';

const read: THandler<never, IUserResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  if (!user_id) return null;
  const [user] = await execQuery.user.getById([user_id]);
  let user_status = session.read('user_status')!;
  if (user_status === 'INSIDE_NET') user_status = 'LOGGEDIN',
  session.delete('net_id');
  session.delete('node_id');
  session.write('user_status', user_status);
  return { ...user!, user_status };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGEDIN';

export = read;
