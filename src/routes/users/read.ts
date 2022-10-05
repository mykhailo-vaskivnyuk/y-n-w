import { type IOperation, type IOperationResponce } from '../../app/types';

export = async (operation: IOperation['data']): Promise<IOperationResponce> => {
  if (typeof DbQueries?.getUsers !== 'function') return {};

  return DbQueries.getUsers([]);
};
