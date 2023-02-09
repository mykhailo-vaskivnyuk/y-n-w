import {
  INetCreateParams, INetResponse,
} from '../../client/common/server/types/types';
import { MAX_NET_LEVEL } from '../../client/common/server/constants';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { updateCountOfNets } from '../utils/net.utils';
import { createTree } from '../utils/nodes.utils';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, userNet }, {  name },
) => {
  const { net_id: parentNetId, net_level = 0 } = userNet || {};
  if (net_level >= MAX_NET_LEVEL) return null;

  /* create net */
  let net;
  if (parentNetId) {
    [net] = await execQuery.net.createChild([parentNetId]);
    await updateCountOfNets(parentNetId);
  } else {
    [net] = await execQuery.net.createInitial([]);
    await execQuery.net.setFirstNet([net!.net_id]);
  }
  const { net_id } = net!;

  /* create node */
  const [node] = await execQuery.node.createInitial([net_id]);

  /* create node tree */
  await createTree(node!);

  /* create net data */
  const [netData] = await execQuery.net.createData([net_id, name]);

  /* create net user data */
  const user_id = session.read('user_id')!;
  await execQuery.net.user.createData([net_id, user_id!]);

  return { ...net!, ...netData!, ...node! };
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
