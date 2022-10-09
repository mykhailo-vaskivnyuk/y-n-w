import { THandler } from '../../router/types';

const handler: THandler<{ id: number }> = async (operation) => {
  try {
    return await execQuery.getUsers([]);
  } catch (e: any) {
    logger.error(e);
    throw e;
  }
};

export = handler;
