import {
  INetCreateParams, INetResponse,
} from '../../client/common/api/types/net.types';
import { THandler } from '../../router/types';
import {
  NetResponseSchema, NetCreateParamsSchema,
} from '../schema/net.schema';
import { createTree } from '../utils/utils';

const create: THandler<INetCreateParams, INetResponse> =
  async ({ session }, { name }) => {
    const user_id = session.read('user_id');

    /* create node */
    const date = new Date().toISOString();
    let [node] = await execQuery.node.createInitial([date, user_id!]);
    [node] = await execQuery.node.setFirstNodeId([node!.node_id]);
    const { node_id } = node!;
    session.write('node_id', node_id);

    /* create node tree */
    await createTree(node!);

    /* create net */
    const parentNetId = session.read('net_id');
    let net;
    if (!parentNetId) {
      [net] = await execQuery.net.createInitial([node_id]);
      [net] = await execQuery.net.setFirstNetId([net!.net_id]);
    } else {
      [net] = await execQuery.net.createChild([parentNetId, node_id]);
      await execQuery.net.updateCountOfNets([parentNetId, 1]);
    }
    const { net_id } = net!;
    session.write('net_id', net_id);

    /* create net data */
    const [netData] = await execQuery.net.createData([net_id, name]);

    /* create net user data */
    await execQuery.net.user.createData([net_id, user_id!]);

    session.write('user_state', 'INSIDE_NET');
    return { ...net!, ...netData! };
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
