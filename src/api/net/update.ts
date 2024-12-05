import { THandler } from '../../controller/types';
import {
  INetUpdateParams,
  INetResponse,
} from '../../client/common/server/types/types';
import { NetResponseSchema, NetUpdateParamsSchema } from '../schema/schema';

const update: THandler<INetUpdateParams, INetResponse> = async (
  { member },
  { goal },
) => {
  const { net_id, parent_node_id, count_of_members } = member!.get();
  if (parent_node_id !== null) return null; // bad request
  if (count_of_members > 1) return null; // bad request
  await execQuery.net.data.update([net_id, goal]);
  const [net] = await execQuery.net.get([net_id]);
  return net!;
};
update.paramsSchema = NetUpdateParamsSchema;
update.responseSchema = NetResponseSchema;
update.checkNet = true;

export = update;
