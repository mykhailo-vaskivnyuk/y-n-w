import Joi from 'joi';
import { THandler } from '../../router/types';
import { findUserNet } from '../utils/net.utils';
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
    const [net, user_status] = await findUserNet(user_id, net_node_id);
    const { node_id, parent_node_id } = net;
    if (user_status !== 'INSIDE_NET') return null;
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
