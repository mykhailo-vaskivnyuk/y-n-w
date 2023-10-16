import Joi from 'joi';
import { IMember, IMemberNode } from '../../../db/types/member.types';
import { THandler } from '../../../router/types';
import { NetEvent } from '../../../services/event/event';
import { createEventMessages } from '../../utils/events/event.messages.create';

const clear: THandler<{ weekAgo: number }, boolean> =
 async ({ isAdmin }, { weekAgo }) => {
   if (!isAdmin) return false;
   const date = new Date();
   const day = date.getDate();
   date.setDate(day - weekAgo * 7);
   const strDate = date.toUTCString();
   let memberMessage: (IMemberNode & { message_id: number}) | undefined;
   do {
     [memberMessage] =
       await execQuery.net.boardMessages.findUnactive([strDate]);
     if (!memberMessage) return true;
     const { message_id, ...memberNode } = memberMessage;
     await execQuery.net.boardMessages.clear([message_id]);
     const event = new NetEvent(memberNode.net_id, 'BOARD_MESSAGE');
     await createEventMessages(event, memberNode as IMember);
     await event.write();
   } while (memberMessage);
   return true;
 };
clear.paramsSchema = { weekAgo: Joi.number().required() };
clear.responseSchema = Joi.boolean();

export = clear;
