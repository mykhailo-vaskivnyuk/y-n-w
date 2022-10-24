import { THandler } from '../../router/types';

const remove: THandler = async (context) => {
  const user_id = await context.session.read('user_id');
  console.log('USER:', user_id);
  if (!user_id) return true;
  await context.session.clear();
  await execQuery.auth.deleteAccount([user_id]);
  return true;
};

export = remove;
