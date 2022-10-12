import { THandler } from '../../router/types';

const handler: THandler = async (context, data) => {
  return { ...data, from: 'merega' };
}

export = handler;
