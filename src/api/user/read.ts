import { IUserResponse } from '../../client/common/api/types';
import { THandler } from '../../router/types';
import { UserResponseSchema } from '../types';

const usersRead: THandler<any, IUserResponse> = async (context) => {
  const { session } = context;
  const user_id = session.read('user_id');
  if (!user_id) return null;
  const [user] = await execQuery.user.getUserById([user_id]);
  if (!user) return null;
  return { ...user, confirmed: !user.link};
};
usersRead.responseSchema = UserResponseSchema;

export = usersRead;
