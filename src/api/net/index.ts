import {
  INetReadParams, INetViewResponse,
} from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema, NetViewResponseSchema } from '../schema/schema';
import { HandlerError } from '../../router/errors';
import { findUserNet, getNetUserStatus } from '../utils/net.utils';

export const getCircle: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const net = await findUserNet(user_id, net_id);
    if (!net) throw new HandlerError('NOT_FOUND');
    const user_status = getNetUserStatus(net);
    if (user_status !== 'INSIDE_NET') return [];
    if (!net.parent_node_id) return [];
    const circle = await execQuery.net.circle
      .get([user_id, net.node_id, net.parent_node_id]);
    return circle;
  };
getCircle.paramsSchema = NetReadParamsSchema;
getCircle.responseSchema = NetViewResponseSchema;

export const getTree: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const net = await findUserNet(user_id, net_id);
    if (!net) throw new HandlerError('NOT_FOUND');
    const user_status = getNetUserStatus(net);
    if (user_status !== 'INSIDE_NET') return [];
    return await execQuery.net.tree.get([user_id, net.node_id]);
  };
getTree.paramsSchema = NetReadParamsSchema;
getTree.responseSchema = NetViewResponseSchema;
