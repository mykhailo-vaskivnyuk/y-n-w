import Joi from 'joi';
import { ITableNetsUsersData } from '../../db/db.types';
import { THandler } from '../../router/types';
import { removeNetUser } from '../utils/net.utils';
import { arrangeNodes } from '../utils/utils';

const disconnect: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();
    let member: ITableNetsUsersData | undefined;
    do {
      [member] = await execQuery.member.find.unactive([strDate]);
      if (!member) return true;
      const { user_id, net_node_id } = member;
      const nodesToArrange =
        await removeNetUser('UNACTIVE_DISCONNECT', user_id, net_node_id);
      await arrangeNodes(nodesToArrange);
    } while (member);
    return true;
  };
disconnect.paramsSchema = {
  monthAgo: Joi.number().required(),
};
disconnect.responseSchema = Joi.boolean();

export = disconnect;
