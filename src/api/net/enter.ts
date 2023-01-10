import { THandler } from '../../router/types';
import {
  INetReadParams, INetResponse,
} from '../../client/common/api/types/types';
import { NetResponseSchema, NetReadParamsSchema } from '../schema/schema';

const enter: THandler<INetReadParams, INetResponse> =
  async ({ session }, { node_id }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.user.net.read([user_id, node_id]);
    return net!;
  };
enter.paramsSchema = NetReadParamsSchema;
enter.responseSchema = NetResponseSchema;

export = enter;
