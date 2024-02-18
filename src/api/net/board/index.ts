import Joi from 'joi';
import { THandler } from '../../../controller/types';
import {
  IBoardRemoveParams, INetBoardReadResponse, INetReadParams,
} from '../../../client/common/server/types/types';
import {
  NetReadParamsSchema, NetBoardReadResponseSchema, BoardRemoveParamsSchema,
} from '../../schema/schema';

export const read: THandler<INetReadParams, INetBoardReadResponse> =
  async ({ member }) => {
    const { net_id } = member!.get();
    return await execQuery.net.boardMessages.get([net_id]);
  };
read.paramsSchema = NetReadParamsSchema;
read.responseSchema = NetBoardReadResponseSchema;
read.checkNet = true;

export const remove: THandler<IBoardRemoveParams, boolean> = async (
  { member }, { node_id, message_id }
) => {
  await execQuery.net.boardMessages.remove([message_id, node_id]);
  const m = member!.get();
  const { net_id } = m;
  const event = new domain.event.NetEvent(net_id, 'BOARD_MESSAGE', m);
  await event.messages.create();
  await event.commit(notificationService);
  return true;
};
remove.paramsSchema = BoardRemoveParamsSchema;
remove.responseSchema = Joi.boolean();
remove.checkNet = true;
