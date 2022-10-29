import { THandler } from '../../router/types';

const remove: THandler = async (context) => {
  const user_id = await context.session.read('user_id');
  if (!user_id) return false;
  await context.session.clear();
  await execQuery.user.remove([user_id]);
  return true;
};

export = remove;
