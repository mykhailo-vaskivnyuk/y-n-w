import Joi from 'joi';
import { THandler } from '../../../controller/types';
import { IBoardSaveParams } from '../../../client/common/server/types/types';
import { BoardSaveParamsSchema } from '../../schema/schema';

const save: THandler<IBoardSaveParams, boolean> = async (
  { member }, { node_id, message_id, message }
) => {
  const m = member!.get();
  const { net_id } = m;
  if (message_id)
    await execQuery.net.boardMessages.update([message_id, node_id, message]);
  else
    await execQuery.net.boardMessages.create([net_id, node_id, message]);
  const event = new domain.event.NetEvent(net_id, 'BOARD_MESSAGE', m);
  await event.messages.create();
  await event.commit(notificationService);
  return true;
};
save.paramsSchema = BoardSaveParamsSchema;
save.responseSchema = Joi.boolean();
save.checkNet = true;

export = save;
