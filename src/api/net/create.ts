import {
  INetCreateParams, INetCreateResponse,
} from '../../client/common/api/types/net.types';
import { THandler } from '../../router/types';
import { NetCreateResponse, NetCreateParamsSchema } from '../schema/net.schema';
import { HandlerError } from '../../router/errors';

const create: THandler<INetCreateParams, INetCreateResponse> =
  async (context, params) => {
    const { session } = context;
    /* check authorized */
    const user_id = session.read('user_id');
    if (!user_id) throw new HandlerError('UNAUTHORIZED');
    /* check confirmed */
    const confirmed = session.read('confirmed');
    if (!confirmed) throw new HandlerError('NOT_CONFIRMED');
    /* create node */
    const date = new Date().toISOString();
    const [node] = await execQuery.node.create(
      [null, null, date, user_id],
    );
    const { node_id } = node!;
    session.write('node_id', node_id);
    /* create tree */
    /* ... */
    /* create net */
    const {
      net_level = 0,
      parent_net_id = null,
      first_net_id = null,
      name,
    } = params;
    const [net] = await execQuery.net.create(
      [net_level, parent_net_id, first_net_id, node_id],
    );
    const { net_id } = net!;
    session.write('net_id', net_id);
    /* create net data */
    const [netData] = await execQuery.net.createData([net_id, name]);
    /* create net user data */
    await execQuery.net.createUserData([net_id, user_id]);
    return { ...net!, ...netData! };
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetCreateResponse;

export = create;
