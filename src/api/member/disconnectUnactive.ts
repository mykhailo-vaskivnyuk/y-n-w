import Joi from 'joi';
import { IMember } from '../../domain/types/member.types';
import { THandler } from '../../controller/types';

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
      const event = new domain
        .event.NetEvent(net_id, 'UNACTIVE_DISCONNECT', member);
      await domain.net.removeMemberFromNet(event);
    } while (member);
    return true;
  };
disconnectUnactive.paramsSchema = { monthAgo: Joi.number().required() };
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
