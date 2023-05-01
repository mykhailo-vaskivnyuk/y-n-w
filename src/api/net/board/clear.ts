import Joi from 'joi';
import { IMember, IMemberAndNet } from '../../../db/types/member.types';
import { THandler } from '../../../router/types';
import { createEventMessages } from '../../utils/events/event.messages.create';

const clear: THandler<{ weekAgo: number }, boolean> =
 async ({ isAdmin }, { weekAgo }) => {
   if (!isAdmin) return false;
   const date = new Date();
   const day = date.getDate();
   date.setDate(day - weekAgo * 7);
   const strDate = date.toUTCString();
   let memberAndNet: IMemberAndNet | undefined;
   do {
     [memberAndNet] = await execQuery.net.boardMessages.findUnactive([strDate]);
     if (!memberAndNet) return true;
     await execQuery.net.boardMessages.clear([strDate]);
     createEventMessages('BOARD_MESSAGE', memberAndNet as IMember);
   } while (memberAndNet);
   return true;
 };
clear.paramsSchema = { weekAgo: Joi.number().required() };
clear.responseSchema = Joi.boolean();

export = clear;
