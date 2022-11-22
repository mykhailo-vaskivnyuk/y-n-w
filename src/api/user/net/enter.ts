import { THandler } from '../../../router/types';
import {
  INetReadParams, INetResponse
} from '../../../client/common/api/types/net.types';
import {
  NetResponseSchema, NetReadParamsSchema,
} from '../../schema/net.schema';

const read: THandler<INetReadParams, INetResponse> =
  async (context, { net_id }) => {
    const { session } = context;
    if (!net_id) {
      session.delete('net_id');
      session.delete('node_id');
      session.write('user_state', 'LOGGEDIN');
      return null;
    }
    const user_id = session.read('user_id');
    const [net] = await execQuery.user.net.read([user_id!, net_id]);
    if (!net) return null;
    session.write('net_id', net_id);
    const [node] = await execQuery.user.node.findByNet([user_id!, net_id]);
    const { node_id } = node!;
    session.write('node_id', node_id);
    session.write('user_state', 'INSIDE_NET');
    return net;
  };
read.paramsSchema = NetReadParamsSchema;
read.responseSchema = NetResponseSchema;

export = read;
