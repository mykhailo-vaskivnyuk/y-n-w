import { THandler } from '../../router/types';
import {
  INetUpdateParams, INetResponse,
} from '../../client/common/server/types/types';
import { NetResponseSchema, NetUpdateParamsSchema } from '../schema/schema';

const update: THandler<INetUpdateParams, INetResponse> =
  async ({ session, userNet }, { goal }) => {
    const { net_id, count_of_members } = userNet!;
    logger.fatal(userNet);
    if (count_of_members > 1) return null; // bad request
    await execQuery.net.update([net_id, goal]);
    const user_id = session.read('user_id');
    const [net] = await execQuery.user.net.read([user_id!, net_id]);
    return net!;
  };
update.paramsSchema = NetUpdateParamsSchema;
update.responseSchema = NetResponseSchema;

export = update;
