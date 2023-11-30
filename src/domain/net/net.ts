import { createTree } from '../utils/nodes.utils';
import { exeWithNetLock } from '../utils/utils';
import { ITableNets } from '../types/db.types';
import { NetEvent } from '../event/event';
import { NetArrange } from './net.arrange';

export const createNet = (
  user_id: number,
  parentNetId: number | null,
  name: string,
) => exeWithNetLock(parentNetId, async (t) => {
  /* create net */
  let net: ITableNets | undefined;
  if (parentNetId) {
    [net] = await t.execQuery.net.createChild([parentNetId]);
    await new domain.net.NetArrange().updateCountOfNets(t, parentNetId);
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
  await t.execQuery.member.create([node_id, user_id]);

  return { ...net!, ...netData!, ...node!, total_count_of_members: 1 };
});

export const removeMemberFromNet = (event: NetEvent) =>
  exeWithNetLock(event.net_id, async (t) => {
    const net = new NetArrange();
    try {
      const nodesToArrange =
        await net.removeMemberFromNetAndSubnets(event);
      await net.arrangeNodes(t, event, nodesToArrange);
    } finally {
      await event.commit(notificationService, t);
    }
  });

export const removeMemberFromAllNets = async (user_id: number) => {
  const userNetDataArr = await execQuery.user.nets.getTop([user_id]);
  for (const userNetData of userNetDataArr) {
    const { net_id } = userNetData;
    const event = new NetEvent(net_id, 'LEAVE', userNetData);
    await removeMemberFromNet(event);
  }
};
