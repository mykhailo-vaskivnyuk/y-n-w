import { THandler } from '../../router/types';
import {
  INetReadParams, INetResponse
} from '../../client/common/api/types/types';
import {
  NetResponseSchema, NetReadParamsSchema,
} from '../schema/schema';
import { HandlerError } from '../../router/errors';

const enter: THandler<INetReadParams, INetResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.user.net.read([user_id, net_id]);
    if (!net) throw new HandlerError('NOT_FOUND');
    const [node] = await execQuery.user.node.findByNet([user_id, net_id]);
    const { node_id } = node!;
    session.write('net_id', net_id);
    session.write('node_id', node_id);
    session.write('user_status', 'INSIDE_NET');
    return net;
  };
enter.paramsSchema = NetReadParamsSchema;
enter.responseSchema = NetResponseSchema;

export = enter;
