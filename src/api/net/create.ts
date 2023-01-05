import {
  INetCreateParams, INetResponse,
} from '../../client/common/api/types/types';
import { MAX_NET_LEVEL } from '../../client/common/api/constants';
import { HandlerError } from '../../router/errors';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { findUserNet, getNetUserStatus } from '../utils/net.utils';
import { createTree } from '../utils/utils';

const create: THandler<INetCreateParams, INetResponse> =
  async ({ session }, { net_node_id: parentNetId, name }) => {
    const user_id = session.read('user_id')!;
    const parentNet = await findUserNet(user_id, parentNetId);
    if (parentNetId) {
      if (!parentNet) throw new HandlerError('NOT_FOUND');
      const user_status = getNetUserStatus(parentNet);
      if (user_status === 'INVITING') return null;
      const { net_level } = parentNet;
      if (net_level >= MAX_NET_LEVEL) return null;
    }

    /* create node */
    // const date = new Date().toISOString();
    const [node] = await execQuery.node.createInitial([user_id!]);
    // [node] = await execQuery.node.setFirstNodeId([node!.node_id]);
    const { node_id } = node!;

    /* create node tree */
    await createTree(node!);

    /* create net */
    let net;
    if (!parentNetId) {
      [net] = await execQuery.net.createInitial([node_id]);
      // [net] = await execQuery.net.setFirstNetId([net!.net_node_id]);
    } else {
      [net] = await execQuery.net.createChild([parentNetId, node_id]);
      await execQuery.net.updateCountOfNets([parentNetId, 1]);
    }
    const { net_node_id } = net!;

    /* create net data */
    const [netData] = await execQuery.net.createData([net_node_id, name]);

    /* create net user data */
    await execQuery.net.user.createData([net_node_id, user_id!]);

    return { ...net!, ...netData! };
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
