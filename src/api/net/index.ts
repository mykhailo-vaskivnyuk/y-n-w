import {
  INetReadParams, INetViewResponse,
} from '../../client/common/server/types/types';
import { THandler } from '../../controller/types';
import { NetReadParamsSchema, NetViewResponseSchema } from '../schema/schema';

export const getCircle: THandler<INetReadParams, INetViewResponse> =
  async ({ member }, { node_id }) => {
    const { parent_node_id, confirmed } = member!.get();
    if (!parent_node_id) return [];
    if (!confirmed) return [];
    return await execQuery
      .net.circle.getData([node_id, parent_node_id]);
  };
getCircle.paramsSchema = NetReadParamsSchema;
getCircle.responseSchema = NetViewResponseSchema;
getCircle.allowedForNetUser = 'INVITING';

export const getTree: THandler<INetReadParams, INetViewResponse> =
  async (_, { node_id }) => await execQuery.net.tree.getData([node_id]);
getTree.paramsSchema = NetReadParamsSchema;
getTree.responseSchema = NetViewResponseSchema;
getTree.allowedForNetUser = 'INVITING';
