import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IBoardSaveParams } from '../../../client/common/server/types/types';
import { BoardSaveParamsSchema } from '../../schema/schema';
import { createEventMessages } from '../../utils/events/event.messages.create';

const save: THandler<IBoardSaveParams, boolean> = async (
  { session, userNet }, { message_id, message }
) => {
  const user_id = session.read('user_id')!;
  const { net_id } = userNet!;
  if (message_id)
    await execQuery.net.board.update([message_id, user_id, message]);
  else
    await execQuery.net.board.create([net_id, user_id, message]);
  createEventMessages('BOARD_MESSAGE', userNet!);
  return true;
};
save.paramsSchema = BoardSaveParamsSchema;
save.responseSchema = Joi.boolean();

export = save;
