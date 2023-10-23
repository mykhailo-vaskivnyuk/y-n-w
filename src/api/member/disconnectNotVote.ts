import Joi from 'joi';
import { ITableNodes } from '../../db/types/db.tables.types';
import { THandler } from '../../router/types';
import { NetEvent } from '../../services/event/event';
import { exeWithNetLock } from '../utils/utils';
import {
  arrangeNodes, removeMemberFromNetAndSubnets,
} from '../utils/net.utils';

const disconnectNotVote: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();
    let parentNode: ITableNodes | undefined;
    do {
      [parentNode] = await execQuery.node.findFreeByDate([strDate]);
      if (!parentNode) return true;
      const { node_id, net_id } = parentNode;
      // eslint-disable-next-line no-loop-func
      await exeWithNetLock(net_id, async (t) => {
        const members = await execQuery.net.tree.getMembers([node_id]);
        const nodesToArrange = [node_id];
        const event = new NetEvent(net_id, 'NOT_VOTE_DISCONNECT');
        for (const member of members) {
          const { user_id, node_id } = member;
          await removeMemberFromNetAndSubnets(event, user_id);
          nodesToArrange.push(node_id);
        }
        await arrangeNodes(t, event, nodesToArrange);
        await event.commit(notificationService, t);
      });
    } while (parentNode);
    return true;
  };
disconnectNotVote.paramsSchema = { monthAgo: Joi.number().required() };
disconnectNotVote.responseSchema = Joi.boolean();

export = disconnectNotVote;
