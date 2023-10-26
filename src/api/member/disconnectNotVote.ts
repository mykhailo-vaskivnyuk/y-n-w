import Joi from 'joi';
import { THandler } from '../../controller/types';
import { NetEvent } from '../../domain/event/event';
import { exeWithNetLock } from '../utils/utils';
import { Net } from '../../domain/net/net';

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
      const net = new Net();
      const event = new NetEvent(net_id, 'NOT_VOTE');
      // eslint-disable-next-line no-loop-func
      await exeWithNetLock(net_id, async (t) => {
        const members = await execQuery.net.tree.getMembers([node_id]);
        const nodesToArrange = [node_id];
        for (const member of members) {
          const { node_id } = member;
          const childEvent = event.createChild('NOT_VOTE_DISCONNECT', member);
          await net.removeMemberFromNetAndSubnets(childEvent);
          nodesToArrange.push(node_id);
        }
        await net.arrangeNodes(t, event, nodesToArrange);
        await event.commit(notificationService, t);
      });
    } while (true);
  };
disconnectNotVote.paramsSchema = { monthAgo: Joi.number().required() };
disconnectNotVote.responseSchema = Joi.boolean();

export = disconnectNotVote;
