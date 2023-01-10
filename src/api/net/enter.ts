import { THandler } from '../../router/types';
import {
  INetEnterParams, INetResponse,
} from '../../client/common/api/types/types';
import { HandlerError } from '../../router/errors';
import { NetResponseSchema, NetEnterParamsSchema } from '../schema/schema';

const enter: THandler<INetEnterParams, INetResponse> =
  async ({ session }, { net_node_id }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.user.net.read([user_id, net_node_id]);
    if (!net) throw new HandlerError('NOT_FOUND');
    return net!;
  };
enter.paramsSchema = NetEnterParamsSchema;
enter.responseSchema = NetResponseSchema;

export = enter;
