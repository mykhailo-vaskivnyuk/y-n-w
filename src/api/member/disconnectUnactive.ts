import Joi from 'joi';
import { IMember } from '../../db/types/member.types';
import { THandler } from '../../controller/types';
import { NetEvent } from '../../domain/event/event';
import { removeMemberFromNet } from '../utils/net.utils';

const disconnectUnactive: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();
    let member: IMember | undefined;
    do {
      [member] = await execQuery.member.find.unactive([strDate]);
      if (!member) return true;
      const { net_id } = member;
      const event = new NetEvent(net_id, 'UNACTIVE_DISCONNECT', member);
      await removeMemberFromNet(event);
    } while (member);
    return true;
  };
disconnectUnactive.paramsSchema = { monthAgo: Joi.number().required() };
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
