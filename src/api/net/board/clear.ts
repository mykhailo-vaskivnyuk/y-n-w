import Joi from 'joi';
import { ITableNets } from '../../../db/types/db.tables.types';
import { IMember } from '../../../db/types/member.types';
import { THandler } from '../../../router/types';
import { createMessagesInNet } from '../../utils/messages.utils';

const clear: THandler<{ weekAgo: number }, boolean> =
 async ({ isAdmin }, { weekAgo }) => {
   if (!isAdmin) return false;
   const date = new Date();
   const day = date.getDate();
   date.setDate(day - weekAgo * 7);
   const strDate = date.toUTCString();
   let net: ITableNets | undefined;
   do {
     [net] = await execQuery.net.board.findUnactive([strDate]);
     if (!net) return true;
     await execQuery.net.board.clear([strDate]);
     createMessagesInNet('BOARD_MESSAGE', net as unknown as IMember);
   } while (net);
   return true;
 };
clear.paramsSchema = { weekAgo: Joi.number().required() };
clear.responseSchema = Joi.boolean();

export = clear;
