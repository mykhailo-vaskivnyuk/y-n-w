import { THandler } from '../../controller/types';
import {
  INetEnterParams,
  INetResponse,
} from '../../client/common/server/types/types';
import { HandlerError } from '../../controller/errors';
import { NetResponseSchema, NetEnterParamsSchema } from '../schema/schema';

const enter: THandler<INetEnterParams, INetResponse> = async (
  { session },
  { net_id },
) => {
  const user_id = session.read('user_id')!;
  /*{ // test transaction
      const t1 = await startTransaction();
      const t2 = await startTransaction();
      logger.fatal('BEFORE FIRST');
      const [locked] = await t1.execQuery.net.lock([1]);
      logger.fatal('BEFORE SECOND', locked);
      await execQuery.net.boardMessages.create([1, 3, 'message']);
      logger.fatal('AFTER SECOND');
      t1.commit();
    }*/
  const [net] = await execQuery.net.find.byUser([net_id, user_id]);
  if (!net) throw new HandlerError('NOT_FOUND');
  await execQuery.member.updateDate([net.node_id]);
  return net;
};
enter.paramsSchema = NetEnterParamsSchema;
enter.responseSchema = NetResponseSchema;

export = enter;
