import {
  INetCreateParams, INetResponse,
} from '../../client/common/server/types/types';
import { ITableNets } from '../../db/types/db.tables.types';
import { MAX_NET_LEVEL } from '../../client/common/server/constants';
import { THandler } from '../../router/types';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';
import { createTree } from '../utils/nodes.utils';
import { exeWithNetLock } from '../utils/utils';
import { Net } from '../../services/net/net';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, userNetData }, { name },
) => {
  const { net_id: parentNetId = null, net_level = 0 } = userNetData || {};
  if (net_level >= MAX_NET_LEVEL) return null;

  return exeWithNetLock(parentNetId, async (t) => {
    /* create net */
    let net: ITableNets | undefined;
    if (parentNetId) {
      [net] = await t.execQuery.net.createChild([parentNetId]);
      await new Net().updateCountOfNets(t, parentNetId);
    } else {
      [net] = await execQuery.net.createRoot([]);
      const { net_id: root_net_id } = net!;
      [net] = await execQuery.net.setRootNet([root_net_id]);
    }
    const { net_id } = net!;

    /* create root node */
    const [node] = await t.execQuery.node.create([net_id]);
    const { node_id } = node!;

    /* create node tree */
    await createTree(t, node!);

    /* create net data */
    const [netData] = await t.execQuery.net.data.create([net_id, name]);

    /* create first member */
    const user_id = session.read('user_id')!;
    await t.execQuery.member.create([node_id, user_id]);

    return { ...net!, ...netData!, ...node!, total_count_of_members: 1 };
  });
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;

export = create;
