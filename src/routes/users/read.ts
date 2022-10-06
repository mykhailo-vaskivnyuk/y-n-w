import { type IOperation, type IOperationResponce } from '../../app/types';

const getUsers = async (operation: IOperation['data']): Promise<IOperationResponce> => {
  logger.debug({ filed: 'field'});
  logger.info('My info');
  logger.warn('My warn');
  logger.error(new Error('My errror'));
  return execQuery.getUsers([]);
};

export = getUsers;
