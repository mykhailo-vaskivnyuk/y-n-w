import { INetViewResponse } from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetViewResponseSchema } from '../schema/schema';

export const getCircle: THandler<never, INetViewResponse> =
  async ({ session }) => {
    const node_id = session.read('node_id')!;
    return await execQuery.net.circle.get([node_id]);
  };
getCircle.responseSchema = NetViewResponseSchema;


export const getTree: THandler<never, INetViewResponse> =
  async ({ session }) => {
    const node_id = session.read('node_id')!;
    return await execQuery.net.tree.get([node_id]);
  };
getTree.responseSchema = NetViewResponseSchema;
