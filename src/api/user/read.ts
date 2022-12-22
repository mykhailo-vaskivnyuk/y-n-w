import { IUserResponse } from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../schema/schema';

const read: THandler<never, IUserResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  if (!user_id) return null;
  const [user] = await execQuery.user.getById([user_id]);
  let user_state = session.read('user_state')!;
  if (user_state === 'INSIDE_NET') user_state = 'LOGGEDIN',
  session.delete('net_id');
  session.delete('node_id');
  session.write('user_state', user_state);
  return { ...user!, user_state };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGEDIN';

export = read;
