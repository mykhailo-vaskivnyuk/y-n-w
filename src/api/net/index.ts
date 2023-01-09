import {
  INetReadParams, INetViewResponse,
} from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema, NetViewResponseSchema } from '../schema/schema';
import { findUserNet } from '../utils/net.utils';

export const getCircle: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { net_node_id }) => {
    const user_id = session.read('user_id')!;
    const [net, user_status] = await findUserNet(user_id, net_node_id);
    if (user_status !== 'INSIDE_NET') return [];
    const { node_id, parent_node_id } = net;
    if (!parent_node_id) return [];
    const circle = await execQuery.net.circle
      .get([user_id, node_id, parent_node_id]);
    return circle;
  };
getCircle.paramsSchema = NetReadParamsSchema;
getCircle.responseSchema = NetViewResponseSchema;

export const getTree: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { net_node_id }) => {
    const user_id = session.read('user_id')!;
    const [net, user_status] = await findUserNet(user_id, net_node_id);
    // logger.fatal(net, user_status);
    if (user_status !== 'INSIDE_NET') return [];
    const { node_id } = net;
    logger.fatal(net);
    const tree = await execQuery.net.tree.get([user_id, node_id]);
    logger.fatal(tree);
    return tree;
  };
getTree.paramsSchema = NetReadParamsSchema;
getTree.responseSchema = NetViewResponseSchema;
