import {
  INetCreateParams, INetCreateResponse,
} from '../../client/common/api/types/net.types';
import { THandler } from '../../router/types';
import { ITableNodes } from '../../db/db.types';
import {
  NetCreateResponseSchema, NetCreateParamsSchema,
} from '../schema/net.schema';

const createTree = async (node: ITableNodes) => {
  const {
    node_level: parent_node_level,
    node_id: parent_node_id,
    first_node_id: parent_first_node_id,
  } = node;
  const node_level = parent_node_level + 1;
  const first_node_id = parent_first_node_id || parent_node_id;
  const date = new Date().toISOString();
  for (let node_position = 1; node_position <= 6; node_position++) {
    await execQuery.node.create([
      node_level,
      node_position,
      parent_node_id,
      first_node_id,
      date,
    ]);
  }
};

const create: THandler<INetCreateParams, INetCreateResponse> =
  async (context, params) => {
    const { session } = context;
    const user_id = session.read('user_id');
    /* create node */
    const date = new Date().toISOString();
    const [node] = await execQuery.node.createInitial([date, user_id!]);
    const { node_id } = node!;
    session.write('node_id', node_id);
    /* create tree */
    await createTree(node!);
    /* create net */
    const { name } = params;
    const [net] = await execQuery.net.create([node_id]);
    const { net_id } = net!;
    session.write('net_id', net_id);
    /* create net data */
    const [netData] = await execQuery.net.createData([net_id, name]);
    /* create net user data */
    await execQuery.net.createUserData([net_id, user_id!]);
    session.write('user_state', 'INSIDE_NET');
    return { ...net!, ...netData! };
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetCreateResponseSchema;

export = create;
