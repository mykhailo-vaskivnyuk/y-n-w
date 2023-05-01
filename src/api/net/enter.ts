import { THandler } from '../../router/types';
import {
  INetEnterParams, INetResponse,
} from '../../client/common/server/types/types';
import { HandlerError } from '../../router/errors';
import { NetResponseSchema, NetEnterParamsSchema } from '../schema/schema';

const enter: THandler<INetEnterParams, INetResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.net.find.byUser([net_id, user_id]);
    if (!net) throw new HandlerError('NOT_FOUND');
    await execQuery.member.updateDate([net.node_id]);
    return net!;
  };
enter.paramsSchema = NetEnterParamsSchema;
enter.responseSchema = NetResponseSchema;

export = enter;
