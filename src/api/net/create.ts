import {
  INetCreateParams, INetResponse,
} from '../../client/common/server/types/types';
import { MAX_NET_LEVEL } from '../../client/common/server/constants';
import { THandler } from '../../controller/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import * as net from '../../domain/net/net';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, userNetData }, { name },
) => {
  const user_id = session.read('user_id')!;
  const { net_id: parentNetId = null, net_level = 0 } = userNetData || {};
  if (net_level >= MAX_NET_LEVEL) return null;
  return domain.net.createNet(user_id, parentNetId, name);
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
