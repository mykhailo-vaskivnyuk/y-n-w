import Joi from 'joi';
import { IMember } from '../../db/types/member.types';
import { THandler } from '../../router/types';
import { NetEvent } from '../../services/event/event';
import { removeMember } from '../utils/utils';

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
      const { user_id, net_id } = member;
      const event = new NetEvent(net_id, 'UNACTIVE_DISCONNECT');
      await removeMember(event, user_id);
    } while (member);
    return true;
  };
disconnectUnactive.paramsSchema = { monthAgo: Joi.number().required() };
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
