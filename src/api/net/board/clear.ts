import Joi from 'joi';
import { IMember, IMemberNode } from '../../../domain/types/member.types';
import { THandler } from '../../../controller/types';

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
      const event = new domain.event.NetEvent(
        memberNode.net_id, 'BOARD_MESSAGE', memberNode as IMember
      );
      await event.messages.create();
      await event.commit();
      event.send();
    } while (memberMessage);
    return true;
  };
clear.paramsSchema = { weekAgo: Joi.number().required() };
clear.responseSchema = Joi.boolean();
clear.checkNet = false;

export = clear;
