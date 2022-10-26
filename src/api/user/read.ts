import { THandler } from '../../router/types';

const usersRead: THandler = async (context) => {
  const { session } = context;
  const user_id = session.read('user_id');
  if (!user_id) return null;
  const [user] = await execQuery.user.getUserById([user_id]);
  if (!user) return null;
  const { email, name, mobile, net_name } = user;
  return { email, name, mobile, net_name };
};

export = usersRead;
