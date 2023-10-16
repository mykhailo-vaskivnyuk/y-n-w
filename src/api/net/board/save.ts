import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IBoardSaveParams } from '../../../client/common/server/types/types';
import { NetEvent } from '../../../services/event/event';
import { BoardSaveParamsSchema } from '../../schema/schema';
import { createEventMessages } from '../../utils/events/event.messages.create';

const save: THandler<IBoardSaveParams, boolean> = async (
  { userNetData }, { node_id, message_id, message }
) => {
  const { net_id } = userNetData!;
  if (message_id)
    await execQuery.net.boardMessages.update([message_id, node_id, message]);
  else
    await execQuery.net.boardMessages.create([net_id, node_id, message]);
  const event = new NetEvent(net_id, 'BOARD_MESSAGE');
  await createEventMessages(event, userNetData!);
  await event.write();
  return true;
};
save.paramsSchema = BoardSaveParamsSchema;
save.responseSchema = Joi.boolean();

export = save;
