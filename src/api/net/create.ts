import {
  INetCreateParams, INetResponse,
} from '../../client/common/server/types/types';
import { MAX_NET_LEVEL } from '../../client/common/server/constants';
import { THandler } from '../../controller/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, member }, { name },
) => {
  const user_id = session.read('user_id')!;
  const net = await member?.getNet();
  const { net_id: parentNetId = null, net_level = 0 } = net || {};
  if (net_level >= MAX_NET_LEVEL) return null;
  return domain.net.createNet(user_id, parentNetId, name);
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
