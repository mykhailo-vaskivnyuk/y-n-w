import { THandler } from '../../router/types';
import {
  INetEnterParams, INetResponse,
} from '../../client/common/api/types/types';
import { HandlerError } from '../../router/errors';
import { NetResponseSchema, NetEnterParamsSchema } from '../schema/schema';

const enter: THandler<INetEnterParams, INetResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.user.net.read([user_id, net_id]);
    if (!net) throw new HandlerError('NOT_FOUND');
    await execQuery.user.net.setActiveDate([user_id, net_id]);
    return net!;
  };
enter.paramsSchema = NetEnterParamsSchema;
enter.responseSchema = NetResponseSchema;

export = enter;
