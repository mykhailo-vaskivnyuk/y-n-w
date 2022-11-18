import { THandler } from '../../router/types';
import { INetCreateResponse } from '../../client/common/api/types/net.types';
import { NetCreateResponseSchema } from '../schema/net.schema';
import Joi from 'joi';

const enter: THandler<{ net_id: number }, INetCreateResponse> =
  async (context, { net_id }) => {
    const { session } = context;
    const user_id = session.read('user_id');
    const [net] = await execQuery.net.readUserData([user_id!, net_id]);
    if (!net) return null;
    const [node] = await execQuery.node.findByUserNet([user_id!, net_id]);
    const { node_id } = node!;
    session.write('net_id', net_id);
    session.write('node_id', node_id);
    session.write('user_state', 'INSIDE_NET');
    return net;
  };
enter.paramsSchema = {
  net_id: Joi.number().required(),
};
enter.responseSchema = NetCreateResponseSchema;

export = enter;
