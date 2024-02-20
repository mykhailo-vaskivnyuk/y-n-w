import Joi from 'joi';
import { THandler } from '../../controller/types';

const disconnectNotVote: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();

    do {
      const [parentNode] = await execQuery.node.findFreeByDate([strDate]);
      if (!parentNode) return true;
      const { node_id, net_id } = parentNode;
      const event = new domain.event.NetEvent(net_id, 'NOT_VOTE');
      // eslint-disable-next-line no-loop-func
      await domain.utils.exeWithNetLock(net_id, async (t) => {
        const [exists] = await execQuery.node.getIfEmpty([node_id]);
        if (!exists) return;
        const net = new domain.net.NetArrange(t);
        const members = await t.execQuery.net.tree.getMembers([node_id]);
        const nodesToArrange = [node_id];
        for (const member of members) {
          const { node_id } = member;
          const childEvent = event.createChild('NOT_VOTE_DISCONNECT', member);
          await net.removeMemberFromNetAndSubnets(childEvent);
          nodesToArrange.push(node_id);
        }
        await net.arrangeNodes(event, nodesToArrange);
        await event.commit(notificationService, t);
      });
      event.send();
    } while (true);
  };
disconnectNotVote.paramsSchema = { monthAgo: Joi.number().required() };
disconnectNotVote.responseSchema = Joi.boolean();

export = disconnectNotVote;
