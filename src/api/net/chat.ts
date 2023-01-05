import Joi from 'joi';
import { THandler } from '../../router/types';
import { HandlerError } from '../../router/errors';
import { findUserNet, getNetUserStatus } from '../utils/net.utils';
import { JOI_NULL } from '../../router/constants';

type INetChatSend = {
  net_node_id: number;
  chatId: number;
  message: string;
}

type INetChatResponse = {
  chatId: number;
  message: string;
} | null;

export const send: THandler<INetChatSend, INetChatResponse> =
  async ({ session }, { net_node_id, chatId, message }) => {
    const user_id = session.read('user_id')!;
    const net = await findUserNet(user_id, net_node_id);
    if (!net) throw new HandlerError('NOT_FOUND');
    const { node_id, parent_node_id } = net;
    const user_status = getNetUserStatus(net);
    if (user_status !== 'INSIDE_NET') return null;
    logger.fatal(chatId, net, chatId !== node_id, chatId !== parent_node_id);
    if (chatId !== +(parent_node_id || 0) && chatId !== +node_id) return null;
    return { chatId, message };
  };
send.paramsSchema = {
  net_node_id: Joi.number().required(),
  chatId: Joi.number().required(),
  message: Joi.string().required(),
};
send.responseSchema = [JOI_NULL, {
  chatId: Joi.number().required(),
  message: Joi.string().required(),
}];
