import Joi from 'joi';
import { THandler } from '../../../router/types';
import {
  IBoardRemoveParams, INetBoardReadResponse, INetReadParams,
} from '../../../client/common/api/types/types';
import {
  NetReadParamsSchema, NetBoardReadResponseSchema, BoardRemoveParamsSchema,
} from '../../schema/schema';
import { createMessages } from '../../utils/messages.create.utils';

export const read: THandler<INetReadParams, INetBoardReadResponse> =
  async ({ userNet }) => {
    const { net_node_id } = userNet!;
    return await execQuery.net.board.get([net_node_id]);
  };
read.paramsSchema = NetReadParamsSchema;
read.responseSchema = NetBoardReadResponseSchema;

export const remove: THandler<IBoardRemoveParams, boolean> = async (
  { session, userNet }, { message_id }
) => {
  const user_id = session.read('user_id')!;
  await execQuery.net.board.remove([message_id, user_id]);
  createMessages('BOARD_MESSAGE', userNet!);
  return true;
};
remove.paramsSchema = BoardRemoveParamsSchema;
remove.responseSchema = Joi.boolean();
