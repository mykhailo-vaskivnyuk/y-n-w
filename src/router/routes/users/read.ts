import { type IOperation, type IOperationResponce } from '../../../app/types';

const getUsers = async (operation: IOperation['data']): Promise<IOperationResponce> => {
  try {
    return await execQuery.getUsers([]);
  } catch (e: any) {
    logger.error(e);
    return {};
  }
};

export = getUsers;
