import { INetCircleResponse } from '../../client/common/api/types/net.types';
import { THandler } from '../../router/types';
import { NetCircleResponseSchema } from '../schema/net.schema';

export const getCircle: THandler<never, INetCircleResponse> =
  async ({ session }) => {
    const node_id = session.read('node_id')!;
    return await execQuery.net.circle.get([node_id]);
  };
getCircle.responseSchema = NetCircleResponseSchema;


export const getTree: THandler<never, INetCircleResponse> =
  async ({ session }) => {
    const node_id = session.read('node_id')!;
    return await execQuery.net.tree.get([node_id]);
  };
getTree.responseSchema = NetCircleResponseSchema;
