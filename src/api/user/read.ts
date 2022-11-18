import { IUserResponse } from '../../client/common/api/types/account.types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../schema/account.schema';

const read: THandler<any, IUserResponse> = async (context) => {
  const { session } = context;
  const user_id = session.read('user_id');
  if (!user_id) return null;
  const [user] = await execQuery.user.getById([user_id]);
  const user_state = session.read('user_state')!;
  const net_id = session.read('net_id')!;
  return { ...user!, user_state, net_id };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGEDIN';

export = read;
