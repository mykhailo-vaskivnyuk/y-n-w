import { THandler } from '../../router/types';

const logout: THandler = async (context) => {
  await context.session.clear();
  return true;
};

export = logout;
