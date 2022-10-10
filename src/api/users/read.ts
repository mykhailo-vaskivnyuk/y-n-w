import { THandler } from '../../router/types';

const handler: THandler = () => {
  return execQuery.getUsers([]);
};

export = handler;
