import {
  INetCreateParams, INetResponse,
} from '../../client/common/server/types/types';
import { MAX_NET_LEVEL } from '../../client/common/server/constants';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { updateCountOfNets } from '../utils/net.utils';
import { createTree } from '../utils/nodes.utils';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, userNet }, { name },
) => {
  const { net_id: parentNetId = null, net_level = 0 } = userNet || {};
  if (net_level >= MAX_NET_LEVEL) return null;

  /* create root node */
  let [node] = await execQuery.node.createInitial([]);
  const { node_id: root_node_id } = node!;
  [node] = await execQuery.node.setRootNode([root_node_id]);

  /* create net */
  let net;
  if (parentNetId) {
    [net] = await execQuery.net.createChild([parentNetId, root_node_id]);
    await updateCountOfNets(parentNetId);
  } else {
    [net] = await execQuery.net.createInitial([root_node_id]);
    const { net_id: root_net_id } = net!;
    [net] = await execQuery.net.setRootNet([root_net_id]);
  }
  const { net_id } = net!;

  /* create node tree */
  await createTree(node!);

  /* create net data */
  const [netData] = await execQuery.net.createData([net_id, name]);

  /* create first member */
  const user_id = session.read('user_id')!;
  await execQuery.net.user.createFirstMember([root_node_id, user_id]);

  return { ...net!, ...netData!, ...node! };
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
