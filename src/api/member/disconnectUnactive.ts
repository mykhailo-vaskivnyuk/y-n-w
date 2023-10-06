import Joi from 'joi';
import { IMember } from '../../db/types/member.types';
import { THandler } from '../../router/types';
import { removeMember } from '../utils/utils';

const disconnectUnactive: THandler<{ monthAgo: number }, boolean> =
  async ({ isAdmin }, { monthAgo }) => {
    if (!isAdmin) return false;
    const date = new Date();
    const month = date.getMonth();
    date.setMonth(month - monthAgo);
    const strDate = date.toUTCString();
    const event = 'UNACTIVE_DISCONNECT';
    let member: IMember | undefined;
    do {
      [member] = await execQuery.member.find.unactive([strDate]);
      if (!member) return true;
      const { user_id, net_id } = member;
      await removeMember(event, user_id, net_id);
    } while (member);
    return true;
  };
disconnectUnactive.paramsSchema = { monthAgo: Joi.number().required() };
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
