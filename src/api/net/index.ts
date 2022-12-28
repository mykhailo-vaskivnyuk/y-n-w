import {
  INetReadParams, INetViewResponse,
} from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema, NetViewResponseSchema } from '../schema/schema';
import { HandlerError } from '../../router/errors';
import { findUserNet } from '../utils/net.utils';

export const getCircle: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const net = await findUserNet(user_id, net_id);
    if (!net) throw new HandlerError('NOT_FOUND');
    return await execQuery.net.circle.get([net.node_id]);
  };
getCircle.paramsSchema = NetReadParamsSchema;
getCircle.responseSchema = NetViewResponseSchema;

export const getTree: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const net = await findUserNet(user_id, net_id);
    if (!net) throw new HandlerError('NOT_FOUND');
    return await execQuery.net.tree.get([net.node_id]);
  };
getTree.paramsSchema = NetReadParamsSchema;
getTree.responseSchema = NetViewResponseSchema;
