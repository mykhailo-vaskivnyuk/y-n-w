import { THandler } from '../../controller/types';
import {
  INetCreateParams,
  INetResponse,
} from '../../client/common/server/types/types';
import { MAX_NET_LEVEL } from '../../client/common/server/constants';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, member },
  { name },
) => {
  const user_id = session.read('user_id')!;
  let parentNetId: number | null = null;
  if (member) {
    const net = await member.getNet();
    const { net_id, net_level } = net;
    if (net_level >= MAX_NET_LEVEL) return null;
    parentNetId = net_id;
  }
  return domain.utils.exeWithNetLock(parentNetId, async (t) => {
    member && (await member!.reinit());
    return domain.net.createNet(user_id, parentNetId, name, t);
  });
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;
create.checkNet = false;

export = create;
