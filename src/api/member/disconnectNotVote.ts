import Joi from 'joi';
import { ITableNodes } from '../../db/types/db.tables.types';
import { THandler } from '../../router/types';
import { removeNetUser } from '../utils/net.utils';
import { arrangeNodes } from '../utils/utils';

const disconnectNotVote: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();
    let parentNode: ITableNodes & { net_id: number } | undefined;
    do {
      [parentNode] = await execQuery.node.find([strDate]);
      if (!parentNode) return true;
      const { node_id, net_id } = parentNode;
      const members = await execQuery.net.tree.getMembers([node_id]);
      const nodesToArrange: number[] = [node_id];
      for (const member of members) {
        const { user_id, node_id } = member;
        await removeNetUser('NOT_VOTE_DISCONNECT', user_id, net_id);
        nodesToArrange.push(node_id);
      }
      // await arrangeNodes(nodesToArrange);
    } while (parentNode);
    return true;
  };
disconnectNotVote.paramsSchema = {
  monthAgo: Joi.number().required(),
};
disconnectNotVote.responseSchema = Joi.boolean();

export = disconnectNotVote;
