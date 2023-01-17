import {
  INetCreateParams, INetResponse,
} from '../../client/common/api/types/types';
import { MAX_NET_LEVEL } from '../../client/common/api/constants';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { updateCountOfNets } from '../utils/net.utils';
import { createTree } from '../utils/nodes.utils';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, userNet }, {  name },
) => {
  let parentNetNodeId: number | undefined;
  if (userNet) {
    const { net_level } = userNet;
    if (net_level >= MAX_NET_LEVEL) return null;
    parentNetNodeId = userNet.net_node_id;
  }

  /* create node */
  let [node] = await execQuery.node.createInitial([]);
  const { node_id: net_node_id } = node!;
  [node] = await execQuery.node.setNetNodeId([net_node_id]);

  /* create node tree */
  await createTree(node!);

  /* create net */
  let net;
  if (parentNetNodeId) {
    [net] = await execQuery.net.createChild([net_node_id, parentNetNodeId]);
    await updateCountOfNets(parentNetNodeId);
  } else {
    [net] = await execQuery.net.createInitial([net_node_id]);
  }

  /* create net data */
  const [netData] = await execQuery.net.createData([net_node_id, name]);

  /* create net user data */
  const user_id = session.read('user_id')!;
  await execQuery.net.user.createData([net_node_id, user_id!]);

  return { ...net!, ...netData! };
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
