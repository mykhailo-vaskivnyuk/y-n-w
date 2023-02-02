import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IBoardSaveParams } from '../../../client/common/api/types/types';
import { BoardSaveParamsSchema } from '../../schema/schema';
import { createMessages } from '../../utils/messages.create.utils';

const save: THandler<IBoardSaveParams, boolean> = async (
  { session, userNet }, { message_id, message }
) => {
  const user_id = session.read('user_id')!;
  const { net_node_id, node_id } = userNet!;
  if (message_id)
    await execQuery.net.board.update([message_id, user_id, message]);
  else
    await execQuery.net.board.create([net_node_id, user_id, node_id, message]);
  createMessages('BOARD_MESSAGE', userNet!);
  return true;
};
save.paramsSchema = BoardSaveParamsSchema;
save.responseSchema = Joi.boolean();

export = save;
