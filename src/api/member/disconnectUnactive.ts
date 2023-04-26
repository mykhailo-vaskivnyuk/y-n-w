import Joi from 'joi';
import { IMemberWithNetId } from '../../db/types/member.types';
import { THandler } from '../../router/types';
import { removeNetUser } from '../utils/net.utils';
import { arrangeNodes } from '../utils/utils';

const disconnectUnactive: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();
    let member: IMemberWithNetId | undefined;
    do {
      [member] = await execQuery.member.find.unactive([strDate]);
      if (!member) return true;
      const { user_id, net_id } = member;
      const nodesToArrange =
        await removeNetUser('UNACTIVE_DISCONNECT', user_id, net_id);
      // await arrangeNodes(nodesToArrange);
    } while (member);
    return true;
  };
disconnectUnactive.paramsSchema = {
  monthAgo: Joi.number().required(),
};
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
