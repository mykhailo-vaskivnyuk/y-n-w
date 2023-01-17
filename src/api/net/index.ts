import {
  INetReadParams, INetViewResponse,
} from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema, NetViewResponseSchema } from '../schema/schema';

export const getCircle: THandler<INetReadParams, INetViewResponse> =
  async ({ session, userNet }, { node_id }) => {
    const { parent_node_id } = userNet!;
    if (!parent_node_id) return [];
    const user_id = session.read('user_id')!;
    return await execQuery.net.circle
      .get([user_id, node_id, parent_node_id]);
  };
getCircle.paramsSchema = NetReadParamsSchema;
getCircle.responseSchema = NetViewResponseSchema;
getCircle.allowedForNetUser = 'INVITING';

export const getTree: THandler<INetReadParams, INetViewResponse> =
  async ({ session }, { node_id }) => {
    const user_id = session.read('user_id')!;
    return await execQuery.net.tree.get([user_id, node_id]);
  };
getTree.paramsSchema = NetReadParamsSchema;
getTree.responseSchema = NetViewResponseSchema;
getTree.allowedForNetUser = 'INVITING';
