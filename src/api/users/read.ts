import { THandler } from '../../router/types';

const usersRead: THandler = (context) => {
  const { session } = context;
  session.write('userId', 1000);
  return execQuery.getUsers([]);
};

export = usersRead;
