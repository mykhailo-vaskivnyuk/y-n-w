import {
  INetCreateParams, INetResponse,
} from '../../client/common/api/types/types';
import { HandlerError } from '../../router/errors';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { findUserNet } from '../utils/net.utils';
import { createTree } from '../utils/utils';

const create: THandler<INetCreateParams, INetResponse> =
  async ({ session }, { net_id: parentNetId, name }) => {
    const user_id = session.read('user_id')!;
    const parentNet = await findUserNet(user_id, parentNetId);
    if (parentNetId && !parentNet) throw new HandlerError('NOT_FOUND');
    if (parentNet?.token) return null;

    /* create node */
    const date = new Date().toISOString();
    let [node] = await execQuery.node.createInitial([date, user_id!]);
    [node] = await execQuery.node.setFirstNodeId([node!.node_id]);
    const { node_id } = node!;

    /* create node tree */
    await createTree(node!);

    /* create net */
    let net;
    if (!parentNetId) {
      [net] = await execQuery.net.createInitial([node_id]);
      [net] = await execQuery.net.setFirstNetId([net!.net_id]);
    } else {
      [net] = await execQuery.net.createChild([parentNetId, node_id]);
      await execQuery.net.updateCountOfNets([parentNetId, 1]);
    }
    const { net_id } = net!;

    /* create net data */
    const [netData] = await execQuery.net.createData([net_id, name]);

    /* create net user data */
    await execQuery.net.user.createData([net_id, user_id!]);

    return { ...net!, ...netData! };
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
