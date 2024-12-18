import Joi from 'joi';
import { IMember } from '../../domain/types/member.types';
import { THandler } from '../../controller/types';

const disconnectUnactive: THandler<{ monthAgo: number }, boolean> = async (
  { isAdmin },
  { monthAgo },
) => {
  if (!isAdmin) return false;
  const date = new Date();
  const month = date.getMonth();
  date.setMonth(month - monthAgo);
  const strDate = date.toUTCString();
  let member: IMember | undefined;
  const remove = domain.net.NetArrange.removeMemberFromNet;
  do {
    [member] = await execQuery.member.find.unactive([strDate]);
    if (!member) return true;
    await remove('UNACTIVE_DISCONNECT', member);
  } while (member);
  return true;
};
disconnectUnactive.paramsSchema = { monthAgo: Joi.number().required() };
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
