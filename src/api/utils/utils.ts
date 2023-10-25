import { ITransaction } from '../../db/types/types';

export const exeWithNetLock = async <T>(
  net_id: number | null,
  func: (t: ITransaction) => T,
) => {
  const t = await startTransaction();
  try {
    if (net_id) await t.execQuery.net.lock([net_id]);
    const result = await func(t);
    await t.commit();
    return result;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
