import { THandler } from '../../router/types';

const handler: THandler = async (operation) => {
  return { ...operation, from: 'merega' };
}

export = handler;
