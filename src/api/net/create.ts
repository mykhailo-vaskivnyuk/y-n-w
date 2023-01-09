import {
  INetCreateParams, INetResponse,
} from '../../client/common/api/types/types';
import { MAX_NET_LEVEL } from '../../client/common/api/constants';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { findUserNet } from '../utils/net.utils';
import { createTree, updateCountOfNets } from '../utils/utils';

const create: THandler<INetCreateParams, INetResponse> =
  async ({ session }, { net_node_id: parentNetId, name }) => {
    const user_id = session.read('user_id')!;
    const [parentNet, user_status] = parentNetId ?
      await findUserNet(user_id, parentNetId) : [];
    if (parentNet) {
      if (user_status !== 'INSIDE_NET') return null;
      const { net_level } = parentNet;
      if (net_level >= MAX_NET_LEVEL) return null;
    }

    /* create node */
    let [node] = await execQuery.node.createInitial([]);
    const { node_id: net_node_id } = node!;
    [node] = await execQuery.node.setNetNodeId([net_node_id]);

    /* create node tree */
    await createTree(node!);

    /* create net */
    let net;
    if (!parentNetId) {
      [net] = await execQuery.net.createInitial([net_node_id]);
    } else {
      [net] = await execQuery.net.createChild([net_node_id, parentNetId]);
      await updateCountOfNets(parentNetId, 1);
    }

    /* create net data */
    const [netData] = await execQuery.net.createData([net_node_id, name]);

    /* create net user data */
    await execQuery.net.user.createData([net_node_id, user_id!]);

    return { ...net!, ...netData! };
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
